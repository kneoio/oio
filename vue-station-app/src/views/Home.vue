<template>
  <div class="home">
    <header class="header" v-show="!expandedStation">
      <h2 ref="title">m i x p l a</h2>
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
              <div class="detail-status-pill" :class="expandedStation.isOnline ? 'online' : 'offline'">
                <span class="status-dot-sm"></span>
                {{ expandedStation.isOnline ? 'Live' : 'Offline' }}
              </div>
              <h1 class="detail-name">{{ expandedStation.name }}</h1>
              <p class="detail-country">{{ expandedStation.currentSong?.artist }}</p>
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

            <div class="detail-section">
              <span class="section-label">Managed by</span>
              <p class="detail-meta">{{ expandedStation.genre }}</p>
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
              <h3>{{ station.name }}</h3>
              <p class="current-song">
                <span v-if="currentStation?.id === station.id && isPlaying">
                  {{ currentSongTitle }} — {{ currentSongArtist }}
                </span>
                <span v-else>
                  {{ station.currentSong?.title }} — {{ station.currentSong?.artist }}
                </span>
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

export default {
  name: 'Home',

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
          id:       brand.id,
          name:     brand.localizedName?.en || brand.slugName,
          slug:     brand.slugName,
          genre:    brand.managedBy || 'Radio',
          description: brand.description || '',
          color:    brand.color || '#FF4757',
          audioUrl: getStreamUrl(brand.slugName),
          isOnline: brand.status === 'ON_LINE',
          status:   brand.status,
          currentSong: {
            title:  brand.status === 'ON_LINE' ? 'Streaming Live' : 'Offline',
            artist: brand.country || 'Unknown',
            tags:   [brand.country, brand.managedBy, brand.status].filter(Boolean)
          }
        }))
      } catch (err) {
        console.error('Error fetching stations:', err)
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

    // ── lifecycle ──────────────────────────────────────────
    let shakeInterval = null

    const startRandomShake = () => {
      shakeInterval = setInterval(() => {
        const cards = stationCards.value
        if (!cards?.length) return
        const card = cards[Math.floor(Math.random() * cards.length)]
        if (!card) return
        gsap.timeline()
          .to(card, { x: gsap.utils.random(-3, 3), y: gsap.utils.random(-2, 2), rotation: gsap.utils.random(-0.8, 0.8), duration: 0.08, ease: 'none' })
          .to(card, { x: gsap.utils.random(-3, 3), y: gsap.utils.random(-2, 2), rotation: gsap.utils.random(-0.8, 0.8), duration: 0.08, ease: 'none' })
          .to(card, { x: 0, y: 0, rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)' })
      }, gsap.utils.random(2000, 5000))
    }

    const stopRandomShake = () => {
      clearInterval(shakeInterval)
      shakeInterval = null
    }

    // ── lifecycle ──────────────────────────────────────────
    onMounted(async () => {
      await fetchStations()

      if (audioRef.value) audioStore.initializeAudio(audioRef.value)

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
              ease: 'power3.out',
              onComplete: () => startRandomShake()
            })
          }
        })
      })

      window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown)
      stopRandomShake()
      ctx?.revert()
      audioStore.stopPlayback()
    })

    return {
      stations, loading, error,
      isPlaying, currentStation, currentSongTitle, currentSongArtist,
      title, stationGrid, stationCards, audioRef,
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

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(232, 222, 222, 0.5);
  font-family: 'Kaylon', sans-serif;
  letter-spacing: 0.25em;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── grid ────────────────────────────────────────────────── */
.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* ── card ────────────────────────────────────────────────── */
.station-card {
  --blur: 1.75rem;
  --box-blur: calc(0.5 * var(--blur));
  --glow: var(--color, #ff4757);

  border-radius: 12px;
  border: 4px solid currentColor;
  box-shadow:
    inset 0 0 0 2px rgba(0,0,0,0.15),
          0 0 0 2px rgba(0,0,0,0.15),
    inset 0 0 var(--box-blur) var(--glow),
          0 0 var(--box-blur) var(--glow);
  color: var(--color, white);
  cursor: pointer;
  transition: transform 0.3s ease, --blur 0.3s ease;
  overflow: hidden;
  background: rgba(0,0,0,0.5);
}

.station-card:hover {
  transform: translateY(-8px);
  --blur: 2.5rem;
}

.station-card:nth-child(1) { --color: #4FC3F7; filter: saturate(175%); }
.station-card:nth-child(2) { --color: #FF6B6B; filter: brightness(110%); }
.station-card:nth-child(3) { --color: #4A148C; filter: brightness(125%); }
.station-card:nth-child(4) { --color: #FFD93D; filter: saturate(200%); }
.station-card:nth-child(5) { --color: #6C63FF; filter: brightness(105%); }
.station-card:nth-child(6) { --color: #00BCD4; filter: brightness(110%); }

/* ── station image area ──────────────────────────────────── */
.station-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.mood-gradient {
  width: 100%;
  height: 100%;
  background: transparent;
  transition: transform 0.3s ease;
}

.station-card:hover .mood-gradient { transform: scale(1.1); }

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: background 0.3s ease;
}

.station-card:hover .play-overlay { background: rgba(0,0,0,0.5); }
.play-overlay .play-btn { pointer-events: auto; }

/* ── play button ─────────────────────────────────────────── */
.play-btn {
  width: 56px;
  height: 56px;
  background: rgba(0,0,0,0.9);
  border: 2px solid rgba(255,255,255,0.35);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}

.play-btn:hover {
  transform: scale(1.18);
  background: rgba(0,0,0,1);
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 20px rgba(255,255,255,0.15);
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
  0%, 100% { box-shadow: 0 0 20px rgba(255,71,87,0.8), 0 0 40px rgba(255,71,87,0.5); }
  50%       { box-shadow: 0 0 30px rgba(255,71,87,1),   0 0 60px rgba(255,71,87,0.7); }
}

.play-btn svg { width: 22px; height: 22px; margin-left: 2px; }

/* ── card info ───────────────────────────────────────────── */
.station-info {
  padding: 1.5rem;
  color: inherit;
  text-align: center;
}

.station-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 0 var(--blur) var(--glow);
}

.current-song {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.8rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
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

/* ── DETAIL PANEL ────────────────────────────────────────── */
.station-detail {
  position: relative;
  width: 100%;
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
  overflow: visible;
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
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  padding: 2.5rem;
  overflow: hidden;
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
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  border-width: 2.5px;
  border-color: color-mix(in srgb, var(--card-color, #FF4757) 60%, white 40%);
}

.detail-play-btn svg { width: 32px; height: 32px; margin-left: 3px; }

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
  font-size: clamp(2rem, 5vw, 3.5rem);
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
  padding: 2rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-chat {
  grid-column: 1 / -1;
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
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(255,255,255,0.07);
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
  border: 1px solid rgba(255,255,255,0.1);
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
  border: 1px solid rgba(255,255,255,0.1);
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  height: 300px;
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

  .station-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 2rem 1.5rem;
    min-height: 48vh;
  }

  .detail-body {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }
}
</style>