<template>
  <div class="home">
    <header class="header">
      <h1 ref="title">Radio Stations</h1>
      <p ref="subtitle">Choose your favorite station</p>
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
            <img :src="station.imageUrl" :alt="station.name" />
            <div class="play-overlay">
              <button class="play-btn" @click.stop="goToStation(station.id)">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="station-info">
            <h3>{{ station.name }}</h3>
            <p>{{ station.genre }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { stationService } from '../services/stationService'

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
    
    onMounted(() => {
      fetchStations()
      
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
      fetchStations,
      goToStation,
      ctx
    }
  },
  
  beforeUnmount() {
    if (this.ctx) {
      this.ctx.revert()
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.station-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.station-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.station-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.station-card:hover .station-image img {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.station-card:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  width: 60px;
  height: 60px;
  background: #0ae448;
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
  background: #0bc34a;
}

.play-btn svg {
  width: 24px;
  height: 24px;
  margin-left: 2px;
}

.station-info {
  padding: 1.5rem;
  color: white;
}

.station-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.station-info p {
  opacity: 0.8;
  font-size: 0.9rem;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.1);
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
  background: #0ae448;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #0bc34a;
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
