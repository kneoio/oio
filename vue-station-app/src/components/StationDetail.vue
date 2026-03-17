<template>
  <div class="station-detail" ref="detailEl">
    <button class="detail-close" @click="$emit('close')">✕</button>

    <div class="detail-header">
      <div class="detail-glow-bg"></div>
      <div class="detail-play-area">
        <button
          class="play-btn"
          :class="{ playing: isActiveStation && isPlaying }"
          @click.stop="quickPlay"
        >
          <svg v-if="isActiveStation && isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      <div class="detail-title">
        <h1>{{ station?.name }}</h1>
        <p class="detail-status">
          {{ station?.isOnline ? 'Live' : 'Offline' }} · {{ station?.currentSong?.artist }}
        </p>
      </div>
    </div>

    <div class="detail-body">
      <div class="detail-now-playing">
        <p class="label">Now playing</p>
        <p class="track">
          <template v-if="isActiveStation">
            {{ currentSongTitle }} — {{ currentSongArtist }}
          </template>
          <template v-else>
            {{ station?.currentSong?.title }}
          </template>
        </p>
      </div>
      <div class="detail-tags">
        <span
          v-for="tag in station?.currentSong?.tags"
          :key="tag"
          class="tag"
          :data-tag="tag"
        >
          {{ tag }}
        </span>
      </div>
      <div class="detail-dj">
        <p class="label">Managed by</p>
        <p>{{ station?.genre }}</p>
      </div>
      <div class="detail-chat">
        <p class="label">Chat with DJ</p>
        <div class="chat-placeholder">
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAudioStore } from '@/stores/audio'

export default {
  name: 'StationDetail',
  props: {
    station: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const detailEl = ref(null)
    const audioStore = useAudioStore()

    const isPlaying = computed(() => audioStore.isPlaying)
    const currentStation = computed(() => audioStore.currentStation)
    const currentSongTitle = computed(() => audioStore.currentSong.title || 'Loading...')
    const currentSongArtist = computed(() => audioStore.currentSong.artist || 'Unknown')
    const isActiveStation = computed(() => currentStation.value?.id === props.station?.id)
    const detailColor = computed(() => props.station?._color || props.station?.color || '#FF4757')

    const quickPlay = async () => {
      await audioStore.togglePlayback(props.station)
    }

    return {
      detailEl,
      isPlaying,
      currentStation,
      currentSongTitle,
      currentSongArtist,
      isActiveStation,
      detailColor,
      quickPlay
    }
  }
}
</script>

<style scoped>
.station-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #101010;
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
  display: flex;
  flex-direction: column;
  color: white;
  --color: v-bind(detailColor);
  border: 3px solid var(--color);
  box-shadow: inset 0 0 40px var(--color), 0 0 40px var(--color);
}

.detail-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
}

.detail-header {
  position: relative;
  height: 45vh;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  gap: 1.5rem;
}

.detail-glow-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, var(--color) 0%, transparent 70%);
  opacity: 0.15;
}

.detail-play-area {
  position: relative;
  z-index: 1;
}

.detail-play-area .play-btn {
  width: 120px;
  height: 120px;
  border-width: 4px;
}

.detail-title {
  position: relative;
  z-index: 1;
}

.detail-title h1 {
  font-size: 3rem;
  margin: 0;
}

.detail-status {
  opacity: 0.7;
  margin-top: 0.5rem;
}

.detail-body {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.5;
  margin-bottom: 0.3rem;
}

.track {
  font-size: 1.2rem;
  font-weight: 600;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chat-placeholder {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  opacity: 0.4;
}
</style>
