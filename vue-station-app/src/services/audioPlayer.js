import Hls from 'hls.js'

class AudioPlayer {
  constructor() {
    this.hls = null
    this.audio = null
    this.isPlaying = false
    this.currentStation = null
    this.currentSong = { title: '', artist: '', display: '' }
    this.eventListeners = new Map()
  }

  init(audioElement) {
    this.audio = audioElement
    this.bindAudioEvents()
  }

  bindAudioEvents() {
    if (!this.audio) return

    const events = ['play', 'pause', 'playing', 'waiting', 'stalled', 'ended', 'error']
    events.forEach(event => {
      this.audio.addEventListener(event, (e) => {
        this.emit(event, e)
      })
    })
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => callback(data))
    }
  }

  // Extract ID3 metadata from TIT2 and TPE1 tags
  extractID3Metadata(data) {
    const text = new TextDecoder('utf-8').decode(data)
    
    // Extract title from TIT2 tag: /TIT2[^\0]*\0([^\0]*)/
    const titleMatch = text.match(/TIT2[^\0]*\0([^\0]*)/)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract artist from TPE1 tag: /TPE1[^\0]*\0([^\0]*)/
    const artistMatch = text.match(/TPE1[^\0]*\0([^\0]*)/)
    const artist = artistMatch ? artistMatch[1].trim() : ''
    
    const display = artist && title ? `${artist} - ${title}` : (title || artist || 'Unknown Song')
    
    return { title, artist, display }
  }

  async playStream(url, station) {
    // Stop current stream if playing
    if (this.isPlaying) {
      this.stop()
    }

    this.currentStation = station
    this.isPlaying = true

    console.log('Loading stream:', url)
    console.log('hls.js supported:', Hls.isSupported())
    console.log('Native HLS:', !!this.audio.canPlayType('application/vnd.apple.mpegurl'))

    // Native HLS for Safari
    const isRealNativeHls = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isRealNativeHls && this.audio.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Using native HLS (Safari)')
      this.audio.src = url
      try {
        await this.audio.play()
      } catch (e) {
        console.error('play() rejected:', e.message)
        this.isPlaying = false
      }
      return
    }

    if (!Hls.isSupported()) {
      console.error('hls.js not supported')
      this.isPlaying = false
      return
    }

    console.log('Using hls.js v' + Hls.version)

    // Create new HLS instance
    this.hls = new Hls({
      enableWorker: true,
      debug: false,
      startPosition: -1,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 5,
      maxBufferLength: 30,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 2,
      manifestLoadingRetryDelay: 2000,
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 2,
      levelLoadingRetryDelay: 2000,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 2000,
    })

    // Bind HLS events
    this.hls.on(Hls.Events.MANIFEST_LOADING, (e, data) => {
      console.log('Manifest loading:', data.url)
    })

    this.hls.on(Hls.Events.MANIFEST_LOADED, (e, data) => {
      console.log('Manifest loaded')
    })

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('Manifest parsed, starting playback')
      this.audio.play().catch(e => console.error('play() rejected:', e.message))
    })

    this.hls.on(Hls.Events.FRAG_PARSING_METADATA, (_, data) => {
      console.log('Received ID3 metadata')
      data.samples.forEach((sample) => {
        if (sample.data) {
          const songInfo = this.extractID3Metadata(sample.data)
          if (songInfo.display && songInfo.display !== this.currentSong.display) {
            this.currentSong = songInfo
            console.log('Updated song from ID3:', songInfo.display)
            this.emit('metadata', songInfo)
          }
        }
      })
    })

    this.hls.on(Hls.Events.ERROR, (e, data) => {
      console.error('HLS Error:', data.type, '/', data.details, data.fatal ? '[FATAL]' : '')
      
      if (!data.fatal) return

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        console.log('Fatal network error → startLoad()')
        this.hls.startLoad()
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        console.log('Fatal media error → recoverMediaError()')
        this.hls.recoverMediaError()
      } else {
        console.log('Unrecoverable error — destroying')
        this.stop()
      }
    })

    // Load source
    this.hls.loadSource(url)
    this.hls.attachMedia(this.audio)
  }

  // Parse M3U8 playlist to get song info from #EXTINF lines
  async parseM3U8(url) {
    try {
      const response = await fetch(url)
      const text = await response.text()
      
      // Find #EXTINF lines with song info
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('#EXTINF:')) {
          // Format: #EXTINF:6,Song Title - Artist Name
          const match = line.match(/#EXTINF:\d+,(.+)/)
          if (match) {
            const songData = match[1].trim()
            // Parse "Title - Artist" format
            const parts = songData.split(' - ')
            if (parts.length >= 2) {
              const title = parts[0].trim()
              const artist = parts.slice(1).join(' - ').trim()
              return { title, artist, display: `${title} - ${artist}` }
            }
            return { title: songData, artist: '', display: songData }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing M3U8:', error)
    }
    return { title: '', artist: '', display: 'Unknown Song' }
  }

  // Start polling M3U8 for song updates
  startM3U8Polling(url) {
    // Clear existing interval
    if (this.m3u8Interval) {
      clearInterval(this.m3u8Interval)
    }
    
    // Parse immediately
    this.parseM3U8(url).then(songInfo => {
      if (songInfo.display && songInfo.display !== this.currentSong.display) {
        this.currentSong = songInfo
        this.emit('metadata', songInfo)
      }
    })
    
    // Poll every 5 seconds
    this.m3u8Interval = setInterval(() => {
      this.parseM3U8(url).then(songInfo => {
        if (songInfo.display && songInfo.display !== this.currentSong.display) {
          this.currentSong = songInfo
          this.emit('metadata', songInfo)
        }
      })
    }, 5000)
  }

  stop() {
    this.isPlaying = false
    this.currentStation = null
    
    // Clear M3U8 polling
    if (this.m3u8Interval) {
      clearInterval(this.m3u8Interval)
      this.m3u8Interval = null
    }

    if (this.hls) {
      this.hls.destroy()
      this.hls = null
      console.log('hls.js destroyed')
    }

    if (this.audio) {
      this.audio.pause()
      this.audio.removeAttribute('src')
      this.audio.load()
    }
  }

  togglePlay(url, station) {
    if (this.isPlaying && this.currentStation?.id === station.id) {
      this.stop()
    } else {
      this.playStream(url, station)
    }
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentStation: this.currentStation,
      currentSong: this.currentSong
    }
  }
}

// Create singleton instance
export const audioPlayer = new AudioPlayer()
export default audioPlayer
