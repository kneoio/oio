<template>
  <div class="station">
    <button class="back-btn" @click="goBack" ref="backBtn">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Back
    </button>
    
    <div v-if="loading" class="loading">
      <div class="skeleton-detail"></div>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Station not found</p>
      <button @click="goBack" class="retry-btn">Go Back</button>
    </div>
    
    <div v-else-if="station" class="station-detail" ref="stationDetail">
      <div class="station-header">
        <div class="station-image-large" ref="stationImage">
          <div class="mood-gradient-large">
          </div>
          <div class="now-playing" v-if="isPlaying" ref="nowPlaying">
            <span>NOW PLAYING</span>
            <div class="audio-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        <div class="station-info-large" ref="stationInfo">
          <h1>{{ station.name }}</h1>
          <p class="genre">{{ station.genre }}</p>
          <div class="now-playing-info">
            <h2>{{ station.currentSong.title }}</h2>
            <p class="artist">{{ station.currentSong.artist }}</p>
            <div class="tags-large">
              <span v-for="tag in station.currentSong.tags" :key="tag" class="tag-large" :data-tag="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="player-controls" ref="playerControls">
            <button 
              class="main-play-btn" 
              @click="togglePlay"
              :class="{ playing: isPlaying }"
              ref="playBtn"
            >
              <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            
            <div class="control-buttons">
              <button class="control-btn" ref="prevBtn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button class="control-btn" ref="nextBtn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="additional-content" ref="additionalContent">
        <h2>More from {{ station.genre }}</h2>
        <div class="similar-stations">
          <div v-for="n in 3" :key="n" class="similar-station-card">
            <div class="similar-mood" :style="{ background: `linear-gradient(135deg, ${getSimilarMoodColor(n)}22, ${getSimilarMoodColor(n)})` }">
              <span>{{ getSimilarMood(n) }}</span>
            </div>
            <div class="similar-info">
              <h4>Similar Station {{ n }}</h4>
              <p>{{ station.genre }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import gsap from 'gsap'
import { stationService } from '../services/stationService'

export default {
  name: 'Station',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const station = ref(null)
    const loading = ref(true)
    const error = ref(false)
    const isPlaying = ref(false)
    
    // Refs for GSAP animations
    const backBtn = ref(null)
    const stationDetail = ref(null)
    const stationImage = ref(null)
    const stationInfo = ref(null)
    const playerControls = ref(null)
    const playBtn = ref(null)
    const prevBtn = ref(null)
    const nextBtn = ref(null)
    const nowPlaying = ref(null)
    const additionalContent = ref(null)
    
    let ctx
    let playAnimation
    
    const fetchStation = async () => {
      loading.value = true
      error.value = false
      try {
        const response = await stationService.getStationById(props.id)
        station.value = response.data
      } catch (err) {
        error.value = true
        console.error('Error fetching station:', err)
      } finally {
        loading.value = false
      }
    }
    
    const togglePlay = () => {
      isPlaying.value = !isPlaying.value
      
      if (isPlaying.value) {
        // Animate play button to pause state
        if (playBtn.value) {
          gsap.to(playBtn.value, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
          })
        }
        
        // Show now playing indicator
        if (nowPlaying.value) {
          gsap.fromTo(nowPlaying.value, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
          )
        }
        
        // Animate audio wave
        gsap.to('.audio-wave span', {
          scaleY: 1.5,
          duration: 0.3,
          stagger: 0.1,
          yoyo: true,
          repeat: -1,
          ease: 'power2.inOut'
        })
      } else {
        // Hide now playing indicator
        if (nowPlaying.value) {
          gsap.to(nowPlaying.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
          })
        }
        
        // Stop audio wave animation
        gsap.killTweensOf('.audio-wave span')
        gsap.set('.audio-wave span', { scaleY: 1 })
      }
    }
    
    const goBack = () => {
      router.push('/')
    }
    
    const getSimilarMood = (index) => {
      const moods = ['DANCE', 'ROCK', 'CHILL']
      return moods[index - 1]
    }
    
    const getSimilarMoodColor = (index) => {
      const colors = ['#FFD93D', '#FF6B6B', '#4FC3F7']
      return colors[index - 1]
    }
    
    onMounted(() => {
      fetchStation()
      
      // GSAP Context for animations
      ctx = gsap.context((self) => {
        // Page entrance animation
        const tl = gsap.timeline()
        
        if (backBtn.value) {
          tl.from(backBtn.value, {
            x: -50,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
          })
        }
        
        if (stationImage.value) {
          tl.from(stationImage.value, {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
          }, '-=0.3')
        }
        
        if (stationInfo.value) {
          tl.from(stationInfo.value, {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.5')
        }
        
        if (playerControls.value) {
          tl.from(playerControls.value, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
          }, '-=0.3')
        }
        
        if (additionalContent.value) {
          tl.from(additionalContent.value, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.3')
        }
        
        // Button hover animations
        const buttons = [playBtn.value, prevBtn.value, nextBtn.value]
        buttons.forEach(btn => {
          if (btn) {
            btn.addEventListener('mouseenter', () => {
              gsap.to(btn, {
                scale: 1.1,
                duration: 0.2,
                ease: 'power2.out'
              })
            })
            
            btn.addEventListener('mouseleave', () => {
              gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
              })
            })
          }
        })
      })
    })
    
    // Watch for route changes
    watch(() => route.params.id, () => {
      if (route.params.id) {
        fetchStation()
        isPlaying.value = false
      }
    })
    
    return {
      station,
      loading,
      error,
      isPlaying,
      backBtn,
      stationDetail,
      stationImage,
      stationInfo,
      playerControls,
      playBtn,
      prevBtn,
      nextBtn,
      nowPlaying,
      additionalContent,
      togglePlay,
      goBack,
      getSimilarMood,
      getSimilarMoodColor
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
.station {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  color: white;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background 0.3s ease, transform 0.3s ease;
}

.back-btn:hover {
  background: #2a2a2a;
  transform: translateX(-5px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.skeleton-detail {
  width: 100%;
  max-width: 800px;
  height: 400px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
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

.station-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.station-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3rem;
}

.station-image-large {
  position: relative;
}

.mood-gradient-large {
  width: 100%;
  height: 400px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease;
  background: transparent;
}

.station-image-large:hover .mood-gradient-large {
  transform: scale(1.02);
}

.now-playing {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.now-playing span {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.audio-wave {
  display: flex;
  gap: 3px;
  align-items: center;
}

.audio-wave span {
  width: 3px;
  height: 20px;
  background: #ff4757;
  border-radius: 3px;
  transform-origin: center;
}

.station-info-large {
  color: white;
}

.station-info-large p {
  opacity: 0.9;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.station-info-large h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.genre {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.now-playing-info {
  margin: 2rem 0;
}

.now-playing-info h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--glow, #ff4757);
  text-shadow: 0 0 20px var(--glow, #ff4757);
}

.artist {
  font-size: 1.2rem !important;
  opacity: 0.8 !important;
  margin-bottom: 1.5rem !important;
}

.tags-large {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.tag-large {
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-large[data-tag="chill"], .tag-large[data-tag="relax"], .tag-large[data-tag="peaceful"], .tag-large[data-tag="sleep"], .tag-large[data-tag="smooth"], .tag-large[data-tag="classy"] {
  background: rgba(79, 195, 247, 0.2);
  color: #4FC3F7;
  border: 1px solid #4FC3F7;
  box-shadow: 0 0 10px rgba(79, 195, 247, 0.3);
}

.tag-large[data-tag="rock"], .tag-large[data-tag="power"], .tag-large[data-tag="guitar"], .tag-large[data-tag="classic"] {
  background: rgba(255, 107, 107, 0.2);
  color: #FF6B6B;
  border: 1px solid #FF6B6B;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
}

.tag-large[data-tag="dark"], .tag-large[data-tag="ambient"], .tag-large[data-tag="atmospheric"], .tag-large[data-tag="deep"], .tag-large[data-tag="mysterious"] {
  background: rgba(74, 20, 140, 0.2);
  color: #9C27B0;
  border: 1px solid #9C27B0;
  box-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
}

.tag-large[data-tag="dance"], .tag-large[data-tag="party"], .tag-large[data-tag="bass"], .tag-large[data-tag="upbeat"] {
  background: rgba(255, 217, 61, 0.2);
  color: #FFD93D;
  border: 1px solid #FFD93D;
  box-shadow: 0 0 10px rgba(255, 217, 61, 0.3);
}

.tag-large[data-tag="sad"], .tag-large[data-tag="emotional"], .tag-large[data-tag="heartbreak"], .tag-large[data-tag="melancholy"], .tag-large[data-tag="rain"] {
  background: rgba(108, 99, 255, 0.2);
  color: #6C63FF;
  border: 1px solid #6C63FF;
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.3);
}

.tag-large[data-tag="jazz"], .tag-large[data-tag="saxophone"], .tag-large[data-tag="study"] {
  background: rgba(0, 188, 212, 0.2);
  color: #00BCD4;
  border: 1px solid #00BCD4;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.3);
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.main-play-btn {
  width: 80px;
  height: 80px;
  background: #ff4757;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.main-play-btn:hover {
  transform: scale(1.05);
  background: #ff3838;
}

.main-play-btn.playing {
  background: #2a2a2a;
}

.main-play-btn svg {
  width: 32px;
  height: 32px;
}

.control-buttons {
  display: flex;
  gap: 1rem;
}

.control-btn {
  width: 50px;
  height: 50px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #2a2a2a;
  transform: scale(1.1);
}

.control-btn svg {
  width: 24px;
  height: 24px;
}

.additional-content {
  color: white;
}

.additional-content h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.similar-stations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.similar-station-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
}

.similar-station-card:hover {
  transform: translateY(-5px);
  background: #2a2a2a;
}

.similar-station-card img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.similar-mood {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.similar-info h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.similar-info p {
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .station {
    padding: 1rem;
  }
  
  .station-header {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .station-info-large h1 {
    font-size: 2rem;
  }
  
  .genre {
    font-size: 1.2rem;
  }
  
  .player-controls {
    justify-content: center;
  }
  
  .main-play-btn {
    width: 60px;
    height: 60px;
  }
  
  .main-play-btn svg {
    width: 24px;
    height: 24px;
  }
}
</style>
