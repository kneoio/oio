<template>
  <div class="home">
    <header class="header">
      <h1 ref="title">Mixpla</h1>
      <p ref="subtitle">Discover your vibe</p>
    </header>
    
    <main class="main">
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
          @click="goToStation(station.id)"
          ref="stationCards"
        >
          <div class="station-image">
            <div class="mood-gradient">
            </div>
            <div class="play-overlay">
              <button class="play-btn" @click.stop="quickPlay(station, $event)">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="station-info">
            <h3>{{ station.name }}</h3>
            <p class="current-song">{{ station.currentSong.title }} - {{ station.currentSong.artist }}</p>
            <div class="tags">
              <span v-for="tag in station.currentSong.tags.slice(0, 3)" :key="tag" class="tag" :data-tag="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <audio ref="audioRef" style="display: none;"></audio>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { stationService } from '../services/stationService'
import { audioPlayer } from '../services/audioPlayer'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const stations = ref([])
    const loading = ref(true)
    const error = ref(false)
    
    // Refs for GSAP animations
    const title = ref(null)
    const subtitle = ref(null)
    const stationGrid = ref(null)
    const stationCards = ref([])
    const audioRef = ref(null)
    
    let ctx
    
    const fetchStations = async () => {
      loading.value = true
      error.value = false
      try {
        const response = await stationService.getAllStations()
        stations.value = response.data
      } catch (err) {
        error.value = true
        console.error('Error fetching stations:', err)
      } finally {
        loading.value = false
      }
    }
    
    const goToStation = (id) => {
      router.push(`/station/${id}`)
    }
    
    const quickPlay = (station, event) => {
      event.stopPropagation()
      if (audioRef.value && !audioPlayer.audio) {
        audioPlayer.init(audioRef.value)
      }
      audioPlayer.togglePlay(station.audioUrl, station)
    }
    
    onMounted(() => {
      fetchStations()
      
      if (audioRef.value) {
        audioPlayer.init(audioRef.value)
      }
      
      // GSAP Context for animations
      ctx = gsap.context((self) => {
        // Animate header if elements exist
        if (title.value) {
          gsap.from(title.value, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          })
        }
        
        if (subtitle.value) {
          gsap.from(subtitle.value, {
            y: -30,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
          })
        }
        
        // Animate station cards when they appear
        if (stationCards.value.length > 0) {
          gsap.from(stationCards.value, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.5,
            ease: 'back.out(1.7)'
          })
        }
      })
    })
    
    return {
      stations,
      loading,
      error,
      title,
      subtitle,
      stationGrid,
      stationCards,
      audioRef,
      fetchStations,
      goToStation,
      quickPlay,
      ctx
    }
  },
  
  beforeUnmount() {
    if (this.ctx) {
      this.ctx.revert()
    }
    audioPlayer.stop()
  }
}
</script>

<style scoped>
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

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: white;
  font-family: 'Kaylon', sans-serif;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.station-card {
  --blur: 1.75rem;
  --box-blur: calc(0.5 * var(--blur));
  --glow: var(--color, #ff4757);
  
  align-items: center;
  border-radius: 12px;
  border: 4px solid currentColor;
  box-shadow: 
    /* inside */ inset 0 0 0 2px rgba(0, 0, 0, 0.15),
    /* outside */      0 0 0 2px rgba(0, 0, 0, 0.15),
    /* glow */
    /* inside */ inset 0 0 var(--box-blur) var(--glow),
    /* outside */      0 0 var(--box-blur) var(--glow);
  color: var(--color, white);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
}

.station-card:hover {
  transform: translateY(-10px);
  --blur: 2.5rem;
  --box-blur: calc(0.5 * var(--blur));
}

.station-card:nth-child(1) { --color: #4FC3F7; filter: saturate(175%); }
.station-card:nth-child(2) { --color: #FF6B6B; filter: brightness(110%); }
.station-card:nth-child(3) { --color: #4A148C; filter: brightness(125%); }
.station-card:nth-child(4) { --color: #FFD93D; filter: saturate(200%); }
.station-card:nth-child(5) { --color: #6C63FF; filter: brightness(105%); }
.station-card:nth-child(6) { --color: #00BCD4; filter: brightness(110%); }

.station-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.mood-gradient {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  background: transparent;
}

.station-card:hover .mood-gradient {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: background 0.3s ease;
}

.station-card:hover .play-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.play-btn {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.play-btn:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 1);
}

.play-btn svg {
  width: 24px;
  height: 24px;
  margin-left: 2px;
}

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
  text-align: center;
}

.station-info p {
  opacity: 0.9;
  font-size: 0.9rem;
  text-align: center;
}

.current-song {
  font-size: 0.85rem !important;
  opacity: 0.8 !important;
  margin-bottom: 0.8rem !important;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 500;
  text-transform: lowercase;
}

.tag[data-tag="chill"], .tag[data-tag="relax"], .tag[data-tag="peaceful"], .tag[data-tag="sleep"], .tag[data-tag="smooth"], .tag[data-tag="classy"] {
  background: rgba(79, 195, 247, 0.2);
  color: #4FC3F7;
  border: 1px solid #4FC3F7;
}

.tag[data-tag="rock"], .tag[data-tag="energetic"], .tag[data-tag="power"], .tag[data-tag="guitar"], .tag[data-tag="classic"] {
  background: rgba(255, 107, 107, 0.2);
  color: #FF6B6B;
  border: 1px solid #FF6B6B;
}

.tag[data-tag="dark"], .tag[data-tag="ambient"], .tag[data-tag="atmospheric"], .tag[data-tag="deep"], .tag[data-tag="mysterious"] {
  background: rgba(74, 20, 140, 0.2);
  color: #9C27B0;
  border: 1px solid #9C27B0;
}

.tag[data-tag="dance"], .tag[data-tag="party"], .tag[data-tag="bass"], .tag[data-tag="upbeat"], .tag[data-tag="energetic"] {
  background: rgba(255, 217, 61, 0.2);
  color: #FFD93D;
  border: 1px solid #FFD93D;
}

.tag[data-tag="sad"], .tag[data-tag="emotional"], .tag[data-tag="heartbreak"], .tag[data-tag="melancholy"], .tag[data-tag="rain"] {
  background: rgba(108, 99, 255, 0.2);
  color: #6C63FF;
  border: 1px solid #6C63FF;
}

.tag[data-tag="jazz"], .tag[data-tag="saxophone"], .tag[data-tag="study"] {
  background: rgba(0, 188, 212, 0.2);
  color: #00BCD4;
  border: 1px solid #00BCD4;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  height: 300px;
  animation: pulse 1.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.7;
  }
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

.retry-btn:hover {
  background: #ff3838;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .station-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>
