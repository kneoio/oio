import Hls from 'hls.js'

class AudioPlayer {
  constructor() {
    this.hls = null
    this.audio = null
    this.isPlaying = false
    this.currentStation = null
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

    this.hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
      console.log(`Manifest parsed — ${data.levels.length} level(s)`)
      this.audio.play().catch(e => console.error('play() rejected:', e.message))
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

  stop() {
    this.isPlaying = false
    this.currentStation = null

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
      currentStation: this.currentStation
    }
  }
}

// Create singleton instance
export const audioPlayer = new AudioPlayer()
export default audioPlayer
