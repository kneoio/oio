# Vue Station App

A modern radio station application built with Vue 3 and GSAP animations.

## Features

- **Home Page**: Browse a grid of radio stations with hover effects and play buttons
- **Station Detail Page**: View detailed station information with animated player controls
- **Smooth Animations**: GSAP-powered page transitions and micro-interactions
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Mock API**: Simulated API calls with loading states

## Tech Stack

- Vue 3 (Composition API)
- Vue Router 4
- GSAP (GreenSock Animation Platform)
- Axios for API calls
- Vite for development

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable components
├── views/          # Page components
│   ├── Home.vue    # Station listing page
│   └── Station.vue # Station detail page
├── router/         # Vue Router configuration
├── services/       # API services
│   └── stationService.js
├── App.vue         # Main app component with page transitions
└── main.js         # App entry point
```

## Animation Features

- Page entrance animations
- Hover effects on station cards
- Play button interactions
- Audio wave visualizations
- Smooth page transitions

## Future Enhancements

- Real audio playback integration
- Real API integration
- Search functionality
- Favorites system
- Audio visualization
- Station categories
