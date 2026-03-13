import axios from 'axios'

// Mock station data
const mockStations = [
  {
    id: 1,
    name: 'Chill Vibes FM',
    genre: 'Lo-fi Hip Hop',
    description: 'Relaxing beats to study and chill to',
    imageUrl: 'https://picsum.photos/300/300?random=1',
    audioUrl: 'https://example.com/audio1.mp3',
    isPlaying: false
  },
  {
    id: 2,
    name: 'Rock Legends',
    genre: 'Classic Rock',
    description: 'The greatest rock hits of all time',
    imageUrl: 'https://picsum.photos/300/300?random=2',
    audioUrl: 'https://example.com/audio2.mp3',
    isPlaying: false
  },
  {
    id: 3,
    name: 'Jazz Central',
    genre: 'Jazz',
    description: 'Smooth jazz 24/7',
    imageUrl: 'https://picsum.photos/300/300?random=3',
    audioUrl: 'https://example.com/audio3.mp3',
    isPlaying: false
  },
  {
    id: 4,
    name: 'Electronic Pulse',
    genre: 'EDM',
    description: 'Non-stop electronic dance music',
    imageUrl: 'https://picsum.photos/300/300?random=4',
    audioUrl: 'https://example.com/audio4.mp3',
    isPlaying: false
  },
  {
    id: 5,
    name: 'Classical Harmony',
    genre: 'Classical',
    description: 'Timeless classical masterpieces',
    imageUrl: 'https://picsum.photos/300/300?random=5',
    audioUrl: 'https://example.com/audio5.mp3',
    isPlaying: false
  },
  {
    id: 6,
    name: 'Pop Hits Radio',
    genre: 'Pop',
    description: 'The latest pop hits and chart toppers',
    imageUrl: 'https://picsum.photos/300/300?random=6',
    audioUrl: 'https://example.com/audio6.mp3',
    isPlaying: false
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
