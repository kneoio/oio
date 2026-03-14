import axios from 'axios'

// Mock station data
const mockStations = [
  {
    id: 1,
    name: 'Lumisonic',
    genre: 'Live Stream',
    mood: 'live',
    description: 'Live HLS stream with real-time metadata',
    color: '#FF4757',
    imageUrl: 'https://picsum.photos/300/300?random=1',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Loading...',
      artist: 'Unknown',
      tags: ['live', 'streaming', 'hls', 'real-time']
    }
  },
  {
    id: 2,
    name: 'Rock Legends',
    genre: 'Classic Rock',
    mood: 'rock',
    description: 'The greatest rock hits of all time',
    color: '#FF6B6B',
    imageUrl: 'https://picsum.photos/300/300?random=2',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Highway Thunder',
      artist: 'The Rebels',
      tags: ['rock', 'energetic', 'classic', 'guitar', 'power']
    }
  },
  {
    id: 3,
    name: 'Dark Waves',
    genre: 'Dark Ambient',
    mood: 'dark',
    description: 'Deep atmospheric soundscapes',
    color: '#4A148C',
    imageUrl: 'https://picsum.photos/300/300?random=3',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Void Walker',
      artist: 'Shadow Collective',
      tags: ['dark', 'ambient', 'atmospheric', 'deep', 'mysterious']
    }
  },
  {
    id: 4,
    name: 'Dance Floor',
    genre: 'EDM',
    mood: 'energetic',
    description: 'Non-stop electronic dance music',
    color: '#FFD93D',
    imageUrl: 'https://picsum.photos/300/300?random=4',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Neon Nights',
      artist: 'DJ Pulse',
      tags: ['dance', 'energetic', 'party', 'bass', 'upbeat']
    }
  },
  {
    id: 5,
    name: 'Sad Songs',
    genre: 'Emotional',
    mood: 'sad',
    description: 'Melancholic melodies for deep feelings',
    color: '#6C63FF',
    imageUrl: 'https://picsum.photos/300/300?random=5',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Rainy Tears',
      artist: 'Melancholy Hearts',
      tags: ['sad', 'emotional', 'heartbreak', 'rain', 'melancholy']
    }
  },
  {
    id: 6,
    name: 'Jazz Central',
    genre: 'Jazz',
    mood: 'chill',
    description: 'Smooth jazz 24/7',
    color: '#00BCD4',
    imageUrl: 'https://picsum.photos/300/300?random=6',
    audioUrl: 'http://localhost:38798/stream/lumisonic/stream.m3u8',
    isPlaying: false,
    currentSong: {
      title: 'Blue Monday',
      artist: 'Jazz Ensemble',
      tags: ['jazz', 'smooth', 'chill', 'saxophone', 'classy']
    }
  }
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const stationService = {
  async getAllStations() {
    await delay(500) // Simulate network delay
    return { data: mockStations }
  },
  
  async getStationById(id) {
    await delay(300)
    const station = mockStations.find(s => s.id === parseInt(id))
    if (!station) {
      throw new Error('Station not found')
    }
    return { data: station }
  }
}
