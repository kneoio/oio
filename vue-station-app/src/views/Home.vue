<template>
  <div class="home" :class="{ 'station-expanded': !!expandedStation }">
    <header class="header" v-show="!expandedStation">
      <div ref="title" class="logo-wrap">
        <span class="header-text">m i x</span>
        <LogoAnimated ref="logoRef" :size="32" />
        <span class="header-text">p l a</span>
      </div>
    </header>

    <main class="main">

      <!-- DETAIL PANEL -->
      <div
        v-if="expandedStation"
        ref="detailEl"
        class="station-detail"
        :style="{ '--card-color': expandedStation._color || expandedStation.color || '#FF4757' }"
      >
          <button class="detail-close" @click="closeStation" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div class="detail-header">
            <div class="detail-glow"></div>
            <div class="detail-play-wrap">
              <button
                class="play-btn detail-play-btn"
                :class="{ playing: currentStation?.id === expandedStation.id && isPlaying }"
                @click="quickPlayDetail"
              >
                <svg v-if="currentStation?.id === expandedStation.id && isPlaying" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div class="detail-title-block">
              <div class="detail-status-pill" :class="expandedStation.isOnline ? 'online' : expandedStation.isIdle ? 'idle' : 'offline'">
                <span class="status-dot-sm"></span>
                {{ expandedStation.isOnline ? 'Live' : expandedStation.isIdle ? 'Idle' : 'Offline' }}
              </div>
              <h1 class="detail-name" :style="expandedStation.titleFont ? { fontFamily: expandedStation.titleFont } : {}">{{ expandedStation.name }}</h1>
              <p class="detail-country">{{ expandedStation.djName || expandedStation.currentSong?.artist }}</p>
            </div>
          </div>

          <div class="detail-body">
            <div class="detail-section">
              <span class="section-label">Now playing</span>
              <p class="detail-track">
                <span v-if="currentStation?.id === expandedStation.id && isPlaying">
                  {{ currentSongTitle }} — {{ currentSongArtist }}
                </span>
                <span v-else>{{ expandedStation.currentSong?.title }}</span>
              </p>
            </div>

            <div class="detail-section">
              <span class="section-label">Tags</span>
              <div class="tags detail-tags">
                <span
                  v-for="tag in expandedStation.currentSong?.tags"
                  :key="tag"
                  class="tag"
                  :data-tag="tag"
                >{{ tag }}</span>
              </div>
            </div>

            <div class="detail-section detail-chat">
              <div class="chat-dj-header">
                <span class="chat-dj-status offline">
                  <span class="chat-status-dot"></span>DJ offline
                </span>
              </div>

              <div class="chat-messages" ref="chatMessages">
                <div class="chat-empty">
                  <p>No messages yet. Say hi!</p>
                </div>
              </div>

              <div class="chat-input-row">
                <label class="chat-attach-btn" title="Attach file">
                  <input type="file" style="display:none" @change="attachFile" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </label>
                <input
                  class="chat-input"
                  type="text"
                  placeholder="Message the DJ..."
                  v-model="chatMessage"
                  @keydown.enter="sendMessage"
                />
                <button class="chat-send-btn" @click="sendMessage">Yo</button>
              </div>
            </div>
          </div>
        </div>
      <!-- GRID — hidden while detail is open -->
      <template v-if="!expandedStation">
        <div v-if="loading" class="loading-grid">
          <div v-for="n in 6" :key="n" class="skeleton-card"></div>
        </div>

        <div v-else-if="error" class="error">
          <p>Failed to load stations. Please try again.</p>
          <button @click="fetchStations" class="retry-btn">Retry</button>
        </div>

        <div v-else class="station-grid" ref="stationGrid">
          <div
            v-for="station in stations"
            :key="station.id"
            class="station-card"
            :class="{ offline: !station.isOnline && !station.isIdle }"
            :style="{ '--color': station.color }"
            @click="goToStation(station, $event)"
            ref="stationCards"
          >
            <div class="station-image">
              <div class="mood-gradient"></div>
              <div class="play-overlay">
                <button
                  class="play-btn"
                  :class="{ playing: currentStation?.id === station.id && isPlaying }"
                  @click.stop="quickPlay(station, $event)"
                >
                  <svg v-if="currentStation?.id === station.id && isPlaying" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="station-info">
              <h3 :style="station.titleFont ? { fontFamily: station.titleFont } : {}">{{ station.name }}</h3>
              <p class="current-song" v-if="currentStation?.id === station.id && isPlaying">
                {{ currentSongTitle }} — {{ currentSongArtist }}
              </p>
              <div class="tags">
                <span
                  v-for="tag in station.currentSong.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                  :data-tag="tag"
                >{{ tag }}</span>
              </div>
            </div>
            <span class="card-led" :class="{ online: station.isOnline, idle: station.isIdle }" :title="station.isOnline ? 'Live' : station.isIdle ? 'Idle' : 'Offline'"></span>
          </div>
        </div>
      </template>

    </main>

    <audio ref="audioRef" style="display: none;"></audio>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import gsap from 'gsap'
import { useAudioStore } from '../stores/audio'
import { useBrandsStore } from '../stores/brands'
import { getStreamUrl } from '@/config/stream.js'
import LogoAnimated from '@/components/LogoAnimated.vue'

export default {
  name: 'Home',
  components: { LogoAnimated },

  setup() {
    const audioStore = useAudioStore()
    const brandsStore = useBrandsStore()

    const stations      = ref([])
    const loading       = computed(() => brandsStore.loading)
    const error         = computed(() => brandsStore.error)
    const isPlaying     = computed(() => audioStore.isPlaying)
    const currentStation = computed(() => audioStore.currentStation)
    const currentSongTitle  = computed(() => audioStore.currentSong.title  || 'Loading...')
    const currentSongArtist = computed(() => audioStore.currentSong.artist || 'Unknown')

    const title        = ref(null)
    const logoRef      = ref(null)
    const stationGrid  = ref(null)
    const stationCards = ref([])
    const audioRef     = ref(null)

    const expandedStation = ref(null)
    const expandedCardEl  = ref(null)
    const detailEl        = ref(null)
    const chatMessages    = ref(null)
    const chatMessage     = ref('')

    const sendMessage = () => {
      const msg = chatMessage.value.trim()
      if (!msg) return
      chatMessage.value = ''
    }

    const attachFile = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      // placeholder — wire to WS upload handler
      event.target.value = ''
    }

    let ctx

    // ── fetch ──────────────────────────────────────────────
    const fetchStations = async () => {
      try {
        await brandsStore.fetchAll()
        stations.value = brandsStore.getEntries.map(brand => ({
          id:       brand.id || brand.slugName,
          name:     brand.localizedName?.en || brand.slugName,
          slug:     brand.slugName,
          djName:   brand.djName || '',
          description: brand.description || '',
          color:     brand.color || '#FF4757',
          titleFont: brand.titleFont || '',
          audioUrl:  getStreamUrl(brand.slugName),
          isOnline: brand.status === 'ON_LINE',
          isIdle:   brand.status === 'IDLE',
          status:   brand.status,
          currentSong: {
            title:  brand.status === 'ON_LINE' ? 'Streaming Live' : brand.status === 'IDLE' ? 'Idle' : 'Offline',
            artist: '',
            tags:   []
          }
        }))
      } catch (err) {
        console.error('Error fetching stations:', err)
      }
    }

    let shakeTween = null
    let shakeTimeout = null

    const startRandomShake = () => {
      if (!stationCards.value?.length || expandedStation.value) return

      const card = stationCards.value[Math.floor(Math.random() * stationCards.value.length)]
      if (!card) return

      shakeTween = gsap.to(card, {
        x: 'random(-3, 3)',
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(card, { x: 0, duration: 0.2, ease: 'power2.out' })
          shakeTimeout = setTimeout(startRandomShake, Math.random() * 2000 + 1000)
        }
      })
    }

    const stopRandomShake = () => {
      if (shakeTween) {
        shakeTween.kill()
        shakeTween = null
      }
      if (shakeTimeout) {
        clearTimeout(shakeTimeout)
        shakeTimeout = null
      }
      if (stationCards.value?.length) {
        stationCards.value.forEach(card => gsap.to(card, { x: 0, duration: 0.2 }))
      }
    }

    // ── open station ───────────────────────────────────────
    const goToStation = (station, event) => {
      const cardEl = event?.currentTarget
      openStation(station, cardEl)
    }

    const openStation = async (station, cardEl) => {
      if (!station || !cardEl || expandedStation.value?.id === station.id) return

      stopRandomShake()

      const color = getComputedStyle(cardEl).getPropertyValue('--color')?.trim()
      expandedStation.value = { ...station, _color: color || station.color }
      expandedCardEl.value  = cardEl

      await nextTick()

      const detail = detailEl.value
      if (!detail) return

      // fade panel itself in
      gsap.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })

      // stagger everything in
      const items = detail.querySelectorAll(
        '.detail-close, .detail-status-pill, .detail-name, .detail-country, .detail-play-wrap, .detail-section'
      )
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: 'power3.out', delay: 0.05 }
      )
    }

    const closeStation = async () => {
      const detail = detailEl.value

      if (!detail) {
        expandedStation.value = null
        expandedCardEl.value  = null
        return
      }

      const items = detail.querySelectorAll(
        '.detail-close, .detail-status-pill, .detail-name, .detail-country, .detail-play-wrap, .detail-section'
      )
      await new Promise(resolve => {
        gsap.to(items, { y: -12, opacity: 0, duration: 0.2, stagger: 0.025, ease: 'power2.in', onComplete: resolve })
      })

      expandedStation.value = null
      expandedCardEl.value  = null

      await nextTick()

      // smoothly animate cards in — no flicker
      if (stationCards.value?.length) {
        gsap.fromTo(stationCards.value,
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
        )
      }

      setTimeout(() => startRandomShake(), 600)
    }

    // ── audio ──────────────────────────────────────────────
    const quickPlay = async (station, event) => {
      event.stopPropagation()
      if (audioRef.value) audioStore.initializeAudio(audioRef.value)
      await audioStore.togglePlayback(station)
    }

    const quickPlayDetail = async () => {
      if (audioRef.value) audioStore.initializeAudio(audioRef.value)
      await audioStore.togglePlayback(expandedStation.value)
    }

    // ── keyboard ───────────────────────────────────────────
    const handleKeydown = (e) => {
      if (e.key === 'Escape' && expandedStation.value) {
        e.preventDefault()
        closeStation()
      }
    }

    // ── polling ────────────────────────────────────────────
    let pollInterval = null

    const pollStations = async () => {
      await brandsStore.patch()
      brandsStore.getEntries.forEach(brand => {
        const station = stations.value.find(s => s.slug === brand.slugName)
        if (!station) return
        station.isOnline = brand.status === 'ON_LINE'
        station.isIdle   = brand.status === 'IDLE'
        station.status   = brand.status
        station.currentSong.title =
          brand.status === 'ON_LINE' ? 'Streaming Live' :
          brand.status === 'IDLE'    ? 'Idle'           : 'Offline'
      })
    }

    // ── lifecycle ──────────────────────────────────────────
    onMounted(async () => {
      await fetchStations()
      pollInterval = setInterval(pollStations, 60_000)

      if (audioRef.value) audioStore.initializeAudio(audioRef.value)

      // Wink logo 3s after page load
      setTimeout(() => logoRef.value?.wink(), 3000)

      ctx = gsap.context(() => {
        if (title.value) {
          gsap.from(title.value, { y: -30, opacity: 0, duration: 0.9, ease: 'power3.out' })
        }
        nextTick(() => {
          if (stationCards.value?.length) {
            gsap.from(stationCards.value, {
              y: 40,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              delay: 0.1,
              ease: 'power3.out'
            })
          }
        })
      })

      window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      clearInterval(pollInterval)
      window.removeEventListener('keydown', handleKeydown)
      ctx?.revert()
      audioStore.stopPlayback()
    })

    return {
      stations, loading, error,
      isPlaying, currentStation, currentSongTitle, currentSongArtist,
      title, logoRef, stationGrid, stationCards, audioRef,
      expandedStation, detailEl, chatMessages, chatMessage,
      fetchStations, goToStation, quickPlay, quickPlayDetail, closeStation, sendMessage, attachFile
    }
  }
}
</script>

<style scoped>
/* ── base ────────────────────────────────────────────────── */
.home {
  min-height: 100vh;
  background: #101010;
  padding: 2rem;
}

.home.station-expanded {
  padding: 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.header-text {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(232, 222, 222, 0.5);
  font-family: 'Kaylon', sans-serif;
  letter-spacing: 0.25em;
}

.logo-svg {
  width: 32px;
  height: 32px;
  color: rgba(232, 222, 222, 0.55);
  overflow: visible;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── grid ────────────────────────────────────────────────── */
.station-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── card ────────────────────────────────────────────────── */
.station-card {
  --blur: 1rem;
  --box-blur: calc(0.5 * var(--blur));
  --glow: var(--color, #ff4757);

  border-radius: 10px;
  border: 2px solid currentColor;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.15),
          0 0 0 1px rgba(0,0,0,0.15),
    inset 0 0 var(--box-blur) var(--glow),
          0 0 var(--box-blur) var(--glow);
  color: var(--color, white);
  cursor: pointer;
  transition: transform 0.25s ease, --blur 0.25s ease, background 0.2s ease;
  overflow: hidden;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.station-card:hover {
  transform: translateX(4px);
  --blur: 1.6rem;
  background: rgba(255,255,255,0.04);
}

.station-card.offline {
  --glow: color-mix(in srgb, var(--color, #ff4757) 35%, transparent);
  border-color: color-mix(in srgb, var(--color, #ff4757) 35%, transparent);
  opacity: 0.75;
}

.station-card.offline:hover {
  opacity: 1;
}


/* ── station image area ──────────────────────────────────── */
.station-image {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
}

.mood-gradient {
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--color, #ff4757) 30%, transparent);
  transition: transform 0.3s ease;
}

.station-card:hover .mood-gradient { transform: scale(1.15); }

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: background 0.3s ease;
}

.station-card:hover .play-overlay { background: rgba(0,0,0,0.45); }
.play-overlay .play-btn { pointer-events: auto; }

/* ── play button ─────────────────────────────────────────── */
.play-btn {
  width: 36px;
  height: 36px;
  background: rgba(0,0,0,0.85);
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.play-btn:hover {
  transform: scale(1.18);
  background: rgba(0,0,0,1);
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 14px rgba(255,255,255,0.15);
}

.play-btn:active {
  transform: scale(0.94);
}

.play-btn.playing {
  background: #ff4757;
  border-color: #ff4757;
  animation: pulse-play 1.5s ease-in-out infinite;
}

@keyframes pulse-play {
  0%, 100% { box-shadow: 0 0 12px rgba(255,71,87,0.8), 0 0 24px rgba(255,71,87,0.5); }
  50%       { box-shadow: 0 0 20px rgba(255,71,87,1),   0 0 40px rgba(255,71,87,0.7); }
}

.play-btn svg { width: 14px; height: 14px; margin-left: 1px; }

/* ── card info ───────────────────────────────────────────── */
.station-info {
  flex: 1;
  padding: 0 1rem;
  color: inherit;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.station-info h3 {
  font-size: 0.95rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 0 var(--blur) var(--glow);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.current-song {
  font-size: 0.75rem;
  opacity: 0.6;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: nowrap;
  margin-right: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 500;
  text-transform: lowercase;
}

/* tag colors */
.tag[data-tag="chill"],.tag[data-tag="relax"],.tag[data-tag="peaceful"],
.tag[data-tag="sleep"],.tag[data-tag="smooth"],.tag[data-tag="classy"] {
  background: rgba(79,195,247,0.2); color: #4FC3F7; border: 1px solid #4FC3F7;
}
.tag[data-tag="rock"],.tag[data-tag="energetic"],.tag[data-tag="power"],
.tag[data-tag="guitar"],.tag[data-tag="classic"] {
  background: rgba(255,107,107,0.2); color: #FF6B6B; border: 1px solid #FF6B6B;
}
.tag[data-tag="dark"],.tag[data-tag="ambient"],.tag[data-tag="atmospheric"],
.tag[data-tag="deep"],.tag[data-tag="mysterious"] {
  background: rgba(74,20,140,0.2); color: #9C27B0; border: 1px solid #9C27B0;
}
.tag[data-tag="dance"],.tag[data-tag="party"],.tag[data-tag="bass"],
.tag[data-tag="upbeat"] {
  background: rgba(255,217,61,0.2); color: #FFD93D; border: 1px solid #FFD93D;
}
.tag[data-tag="sad"],.tag[data-tag="emotional"],.tag[data-tag="heartbreak"],
.tag[data-tag="melancholy"],.tag[data-tag="rain"] {
  background: rgba(108,99,255,0.2); color: #6C63FF; border: 1px solid #6C63FF;
}
.tag[data-tag="jazz"],.tag[data-tag="saxophone"],.tag[data-tag="study"] {
  background: rgba(0,188,212,0.2); color: #00BCD4; border: 1px solid #00BCD4;
}

/* ── status LED ──────────────────────────────────────────── */
.card-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 1.1rem;
  background: rgba(255,255,255,0.15);
  box-shadow: none;
  transition: background 0.3s, box-shadow 0.3s;
}

.card-led.online {
  background: #00e676;
  box-shadow: 0 0 6px 2px rgba(0,230,118,0.7), 0 0 12px rgba(0,230,118,0.4);
  animation: led-pulse 2s ease-in-out infinite;
}

.card-led.idle {
  background: #ffb300;
  box-shadow: 0 0 6px 2px rgba(255,179,0,0.7), 0 0 12px rgba(255,179,0,0.4);
  animation: led-pulse-idle 2s ease-in-out infinite;
}

@keyframes led-pulse-idle {
  0%, 100% { box-shadow: 0 0 5px 2px rgba(255,179,0,0.7), 0 0 10px rgba(255,179,0,0.4); }
  50%       { box-shadow: 0 0 9px 3px rgba(255,179,0,0.9), 0 0 18px rgba(255,179,0,0.6); }
}

@keyframes led-pulse {
  0%, 100% { box-shadow: 0 0 5px 2px rgba(0,230,118,0.7), 0 0 10px rgba(0,230,118,0.4); }
  50%       { box-shadow: 0 0 9px 3px rgba(0,230,118,0.9), 0 0 18px rgba(0,230,118,0.6); }
}

/* ── DETAIL PANEL ────────────────────────────────────────── */
.station-detail {
  position: relative;
  width: 100%;
  height: calc(100dvh - 2rem); /* fits within station-expanded padding */
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 4px solid var(--card-color, #FF4757);
  box-shadow:
    inset 0 0 0 2px rgba(0,0,0,0.15),
          0 0 0 2px rgba(0,0,0,0.15),
    inset 0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 20%, transparent),
          0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 30%, transparent);
  background: rgba(0,0,0,0.5);
  overflow: hidden;
}

/* close button */
.detail-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.5);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.detail-close:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: rgba(255,255,255,0.4);
}

.detail-close svg { width: 16px; height: 16px; }

/* header */
.detail-header {
  position: relative;
  min-height: clamp(140px, 28dvh, 320px);
  display: flex;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 2rem);
  padding: clamp(1rem, 3vw, 2.5rem);
  overflow: hidden;
  flex-shrink: 0;
}

.detail-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 40% 60%,
    color-mix(in srgb, var(--card-color, #FF4757) 25%, transparent),
    transparent 70%
  );
  pointer-events: none;
}

/* play button in detail — larger */
.detail-play-btn {
  width: clamp(52px, 10vw, 88px);
  height: clamp(52px, 10vw, 88px);
  flex-shrink: 0;
  border-width: 2.5px;
  border-color: color-mix(in srgb, var(--card-color, #FF4757) 60%, white 40%);
}

.detail-play-btn svg { width: clamp(20px, 4vw, 32px); height: clamp(20px, 4vw, 32px); margin-left: 3px; }

.detail-play-btn:hover {
  transform: scale(1.1);
  border-color: var(--card-color, #FF4757);
  box-shadow: 0 0 30px color-mix(in srgb, var(--card-color, #FF4757) 60%, transparent);
}

.detail-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* status pill */
.detail-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  width: fit-content;
}

.detail-status-pill.online {
  background: rgba(0,230,118,0.15);
  color: #00e676;
  border: 1px solid rgba(0,230,118,0.3);
}

.detail-status-pill.offline {
  background: rgba(255,71,87,0.15);
  color: #ff4757;
  border: 1px solid rgba(255,71,87,0.3);
}

.detail-status-pill.idle {
  background: rgba(255,179,0,0.15);
  color: #ffb300;
  border: 1px solid rgba(255,179,0,0.3);
}

.status-dot-sm {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.4s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.detail-name {
  font-size: clamp(1.3rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 60%, transparent);
  line-height: 1.1;
  margin: 0;
}

.detail-country {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
  letter-spacing: 1px;
}

/* body */
.detail-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: clamp(0.75rem, 2vw, 2rem) clamp(0.75rem, 2.5vw, 2.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(0.75rem, 2vw, 2rem);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-chat {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--card-color, #FF4757) 80%, white 20%);
  opacity: 0.8;
}

.detail-track {
  font-size: 1rem;
  color: white;
  opacity: 0.9;
  margin: 0;
}

.detail-meta {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

.detail-tags {
  justify-content: flex-start;
}

/* ── chat ───────────────────────────────────────────────── */
.chat-dj-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.chat-dj-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
}

.chat-dj-status.offline { color: rgba(255,255,255,0.3); }
.chat-dj-status.online  { color: #00e676; }

.chat-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.chat-dj-status.online .chat-status-dot {
  animation: blink 1.4s ease-in-out infinite;
}

.chat-messages {
  flex: 1;
  min-height: 80px;
  max-height: none;
  overflow-y: auto;
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  padding: 12px;
  background: rgba(0,0,0,0.3);
}

.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.chat-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-empty p {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.2);
  letter-spacing: 1px;
  margin: 0;
}

.chat-input-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
}

.chat-attach-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.chat-attach-btn:hover {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  border-color: rgba(255,255,255,0.25);
}

.chat-attach-btn svg { width: 16px; height: 16px; }

.chat-input {
  flex: 1;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input::placeholder { color: rgba(255,255,255,0.25); }
.chat-input:focus { border-color: var(--card-color, #FF4757); }

.chat-send-btn {
  padding: 0 16px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: var(--card-color, #FF4757);
  color: #000;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
}

.chat-send-btn:hover { transform: scale(1.08); }
.chat-send-btn:active { transform: scale(0.93); }

/* ── loading / error ─────────────────────────────────────── */
.loading-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  height: 64px;
  animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
}

@keyframes skeleton-pulse {
  from { opacity: 0.3; }
  to   { opacity: 0.7; }
}

.error {
  text-align: center;
  color: white;
  padding: 3rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: #ff4757;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover { background: #ff3838; }

/* ── responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .home { padding: 1rem; }
  .home.station-expanded { padding: 0.5rem; }

  .station-grid { gap: 0.4rem; }
  .station-info { gap: 0.5rem; }
  .station-info h3 { max-width: none; }

  .station-detail {
    height: calc(100dvh - 1rem);
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    min-height: unset;
  }

  .detail-body {
    grid-template-columns: 1fr;
  }
}
</style>