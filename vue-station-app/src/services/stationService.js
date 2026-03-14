import axios from 'axios'

// Mock station data
const mockStations = [
  {
    id: 1,
    name: 'Chill Vibes FM',
    genre: 'Lo-fi Hip Hop',
    mood: 'chill',
    description: 'Relaxing beats to study and chill to',
    color: '#4FC3F7',
    audioUrl: 'https://example.com/audio1.mp3',
    isPlaying: false,
    currentSong: {
      title: 'Midnight Dreams',
      artist: 'Lofi Producer',
      tags: ['chill', 'relax', 'study', 'sleep', 'peaceful']
    }
  },
  {
    id: 2,
    name: 'Rock Legends',
    genre: 'Classic Rock',
    mood: 'rock',
    description: 'The greatest rock hits of all time',
    color: '#FF6B6B',
    audioUrl: 'https://example.com/audio2.mp3',
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
    audioUrl: 'https://example.com/audio3.mp3',
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
    audioUrl: 'https://example.com/audio4.mp3',
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
    audioUrl: 'https://example.com/audio5.mp3',
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
    audioUrl: 'https://example.com/audio6.mp3',
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
