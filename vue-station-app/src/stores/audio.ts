import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Hls from 'hls.js'

export interface Station {
  id: number
  name: string
  slug: string
  genre: string
  description: string
  color: string
  imageUrl: string
  streamUrl: string
  isOnline: boolean
  currentListeners?: number
}

export interface SongInfo {
  title: string
  artist: string
  display: string
}

export interface PlaybackState {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

export const useAudioStore = defineStore('audio', () => {
  // State
  const currentStation = ref<Station | null>(null)
  const currentSong = ref<SongInfo>({ title: '', artist: '', display: '' })
  const playbackState = ref<PlaybackState>({
    isPlaying: false,
    isLoading: false,
    hasError: false
  })
  const stations = ref<Station[]>([])
  const audioElement = ref<HTMLAudioElement | null>(null)
  const hlsInstance = ref<Hls | null>(null)
  const metadataUpdateInterval = ref<NodeJS.Timeout | null>(null)

  // Getters
  const isPlaying = computed(() => playbackState.value.isPlaying)
  const isLoading = computed(() => playbackState.value.isLoading)
  const hasError = computed(() => playbackState.value.hasError)
  const currentSongDisplay = computed(() => currentSong.value.display || 'Unknown Song')

  // Actions
  const initializeAudio = (audio: HTMLAudioElement) => {
    audioElement.value = audio
    
    // Set up audio event listeners
    audio.addEventListener('play', () => {
      playbackState.value.isPlaying = true
    })
    
    audio.addEventListener('pause', () => {
      playbackState.value.isPlaying = false
    })
    
    audio.addEventListener('error', (e) => {
      playbackState.value.hasError = true
      playbackState.value.errorMessage = 'Audio playback error'
      console.error('Audio error:', e)
    })
    
    audio.addEventListener('waiting', () => {
      playbackState.value.isLoading = true
    })
    
    audio.addEventListener('playing', () => {
      playbackState.value.isLoading = false
    })
  }

  const extractID3Metadata = (data: Uint8Array): SongInfo => {
    const text = new TextDecoder('utf-8').decode(data)
    
    // Extract title from TIT2 tag
    const titleMatch = text.match(/TIT2[^\0]*\0([^\0]*)/)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract artist from TPE1 tag
    const artistMatch = text.match(/TPE1[^\0]*\0([^\0]*)/)
    const artist = artistMatch ? artistMatch[1].trim() : ''
    
    const display = artist && title ? `${artist} - ${title}` : (title || artist || 'Unknown Song')
    
    return { title, artist, display }
  }

  const parseM3U8Playlist = async (url: string): Promise<SongInfo> => {
    try {
      const response = await fetch(url)
      const text = await response.text()
      
      // Look for EXTINF lines which contain song info
      const extinfMatch = text.match(/#EXTINF:-?\d+,(.+)/m)
      if (extinfMatch) {
        const info = extinfMatch[1].trim()
        
        // Try to parse "Artist - Title" format
        const parts = info.split(' - ')
        if (parts.length >= 2) {
          const artist = parts[0].trim()
          const title = parts.slice(1).join(' - ').trim()
          return { title, artist, display: `${artist} - ${title}` }
        } else {
          return { title: info, artist: '', display: info }
        }
      }
    } catch (error) {
      console.error('Error parsing M3U8:', error)
    }
    
    return { title: '', artist: '', display: 'Unknown Song' }
  }

  const updateSongFromPlaylist = async () => {
    if (!currentStation.value) return
    
    try {
      const songInfo = await parseM3U8Playlist(currentStation.value.streamUrl)
      if (songInfo.display && songInfo.display !== currentSong.value.display) {
        currentSong.value = songInfo
      }
    } catch (error) {
      console.error('Error updating song from playlist:', error)
    }
  }

  const playStation = async (station: Station) => {
    if (!audioElement.value) {
      console.error('Audio element not initialized')
      return
    }

    // Stop current playback
    stopPlayback()

    currentStation.value = station
    playbackState.value.isLoading = true
    playbackState.value.hasError = false

    try {
      // Check for native HLS support (Safari)
      const isRealNativeHls = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      
      if (isRealNativeHls && audioElement.value.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Using native HLS (Safari)')
        audioElement.value.src = station.streamUrl
        
        // Set up ID3 metadata extraction for Safari
        audioElement.value.addEventListener('loadedmetadata', () => {
          // Safari doesn't expose ID3 data easily, so we'll rely on playlist parsing
          startMetadataUpdates()
        })
        
        await audioElement.value.play()
      } else if (Hls.isSupported()) {
        console.log('Using hls.js')
        
        // Create new HLS instance
        hlsInstance.value = new Hls({
          enableWorker: true,
          debug: false,
          startPosition: -1,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 5,
          maxBufferLength: 30,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          manifestLoadingRetryDelay: 2000,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 3,
          levelLoadingRetryDelay: 2000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 4,
          fragLoadingRetryDelay: 2000,
        })

        // Set up HLS event listeners
        hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('Manifest parsed, starting playback')
          audioElement.value?.play()
          startMetadataUpdates()
        })

        hlsInstance.value.on(Hls.Events.ERROR, (_, data) => {
          console.error('HLS Error:', data.type, '/', data.details, data.fatal ? '[FATAL]' : '')
          
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              console.log('Fatal network error → startLoad()')
              hlsInstance.value?.startLoad()
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              console.log('Fatal media error → recoverMediaError()')
              hlsInstance.value?.recoverMediaError()
            } else {
              console.log('Unrecoverable error → destroying')
              stopPlayback()
              playbackState.value.hasError = true
              playbackState.value.errorMessage = 'Stream unavailable'
            }
          }
        })

        // Listen for ID3 metadata
        hlsInstance.value.on(Hls.Events.FRAG_PARSING_METADATA, (_, data) => {
          console.log('Received ID3 metadata')
          data.samples.forEach((sample) => {
            if (sample.data) {
              const songInfo = extractID3Metadata(sample.data)
              if (songInfo.display && songInfo.display !== currentSong.value.display) {
                currentSong.value = songInfo
                console.log('Updated song from ID3:', songInfo.display)
              }
            }
          })
        })

        hlsInstance.value.loadSource(station.streamUrl)
        hlsInstance.value.attachMedia(audioElement.value)
      } else {
        throw new Error('HLS not supported')
      }
    } catch (error) {
      console.error('Error playing station:', error)
      playbackState.value.hasError = true
      playbackState.value.errorMessage = 'Failed to start playback'
      playbackState.value.isLoading = false
    }
  }

  const startMetadataUpdates = () => {
    // Clear existing interval
    if (metadataUpdateInterval.value) {
      clearInterval(metadataUpdateInterval.value)
    }

    // Update immediately
    updateSongFromPlaylist()

    // Then update every 5 seconds
    metadataUpdateInterval.value = setInterval(updateSongFromPlaylist, 5000)
  }

  const stopPlayback = () => {
    if (metadataUpdateInterval.value) {
      clearInterval(metadataUpdateInterval.value)
      metadataUpdateInterval.value = null
    }

    if (hlsInstance.value) {
      hlsInstance.value.destroy()
      hlsInstance.value = null
    }

    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.removeAttribute('src')
      audioElement.value.load()
    }

    playbackState.value.isPlaying = false
    playbackState.value.isLoading = false
    currentStation.value = null
    currentSong.value = { title: '', artist: '', display: '' }
  }

  const togglePlayback = async (station: Station) => {
    if (currentStation.value?.id === station.id && isPlaying.value) {
      stopPlayback()
    } else {
      await playStation(station)
    }
  }

  const fetchStations = async () => {
    try {
      // Mock data - replace with actual API call
      const mockStations: Station[] = [
        {
          id: 1,
          name: 'Chill Vibes FM',
          slug: 'chill-vibes',
          genre: 'Lo-fi Hip Hop',
          description: 'Relaxing beats to study and chill to',
          color: '#4FC3F7',
          imageUrl: 'https://picsum.photos/300/300?random=1',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: true,
          currentListeners: 1234
        },
        {
          id: 2,
          name: 'Rock Legends',
          slug: 'rock-legends',
          genre: 'Classic Rock',
          description: 'The greatest rock hits of all time',
          color: '#FF6B6B',
          imageUrl: 'https://picsum.photos/300/300?random=2',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: true,
          currentListeners: 892
        },
        {
          id: 3,
          name: 'Dark Waves',
          slug: 'dark-waves',
          genre: 'Dark Ambient',
          description: 'Deep atmospheric soundscapes',
          color: '#4A148C',
          imageUrl: 'https://picsum.photos/300/300?random=3',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: false,
          currentListeners: 0
        },
        {
          id: 4,
          name: 'Dance Floor',
          slug: 'dance-floor',
          genre: 'EDM',
          description: 'Non-stop electronic dance music',
          color: '#FFD93D',
          imageUrl: 'https://picsum.photos/300/300?random=4',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: true,
          currentListeners: 2156
        },
        {
          id: 5,
          name: 'Jazz Central',
          slug: 'jazz-central',
          genre: 'Jazz',
          description: 'Smooth jazz 24/7',
          color: '#00BCD4',
          imageUrl: 'https://picsum.photos/300/300?random=5',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: true,
          currentListeners: 567
        },
        {
          id: 6,
          name: 'Electronic Pulse',
          slug: 'electronic-pulse',
          genre: 'Electronic',
          description: 'Cutting edge electronic music',
          color: '#9C27B0',
          imageUrl: 'https://picsum.photos/300/300?random=6',
          streamUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
          isOnline: true,
          currentListeners: 1443
        }
      ]

      stations.value = mockStations
      
      // Simulate checking online status
      await Promise.all(
        stations.value.map(async (station) => {
          try {
            const response = await fetch(station.streamUrl, { method: 'HEAD' })
            station.isOnline = response.ok
          } catch {
            station.isOnline = false
          }
        })
      )
    } catch (error) {
      console.error('Error fetching stations:', error)
      throw error
    }
  }

  return {
    // State
    currentStation,
    currentSong,
    playbackState,
    stations,
    
    // Getters
    isPlaying,
    isLoading,
    hasError,
    currentSongDisplay,
    
    // Actions
    initializeAudio,
    playStation,
    stopPlayback,
    togglePlayback,
    fetchStations
  }
})
