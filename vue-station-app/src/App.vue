<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const app = ref()
let ctx

const onBeforeEnter = (el) => {
  gsap.set(el, {
    opacity: 0,
    y: 20
  })
}

const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power3.out',
    onComplete: done
  })
}

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}

onMounted(() => {
  // Skip initial app animation to avoid ref issues
})
</script>

<template>
  <div ref="app" class="app">
    <router-view v-slot="{ Component, route }">
      <transition 
        name="page" 
        mode="out-in"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<style>
@font-face {
  font-family: 'Kaylon';
  src: url('/src/assets/fonts/kaylon.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Kaylon';
  src: url('/src/assets/fonts/kaylon.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
  background-color: #0a0a0a;
  color: #ffffff;
}

.app {
  min-height: 100vh;
  background-color: #0a0a0a;
}

/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
