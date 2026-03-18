<template>
  <div class="visual-demo">
    <h2 ref="title" class="demo-title">Visual Effects</h2>
    <p class="demo-sub">Each card generates a unique animation via LLM</p>

    <div class="effect-grid">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="effect-card"
        :ref="el => cardEls[i] = el"
        @click="regenerate(i)"
      >
        <!-- LLM-generated SVG animation renders here -->
        <div
          class="card-svg-wrap"
          v-if="card.svg"
          v-html="card.svg"
        ></div>

        <!-- loading state -->
        <div v-else-if="card.loading" class="card-loading">
          <div class="loading-bar" :ref="el => loadingBars[i] = el"></div>
        </div>

        <!-- error -->
        <div v-else-if="card.error" class="card-error">
          <span>✕</span>
          <span class="card-error-hint">click to retry</span>
        </div>

        <div class="card-label">{{ card.prompt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import gsap from 'gsap'

// Song moods/genres to demo — in real usage pass song metadata
const MOODS = [
  'jazz saxophone late night',
  'aggressive heavy metal',
  'dreamy lo-fi rain',
  'euphoric rave bass',
  'melancholy piano solo',
  'tropical summer pop',
  'dark ambient drone',
  'funky 70s groove',
  'classical violin storm',
  'synthwave retro neon',
  'folk acoustic campfire',
  'breakbeat industrial',
]

const LLM_SYSTEM_PROMPT = `You are a generative SVG artist. 
Given a music mood/genre description, produce a single self-contained animated SVG (viewBox="0 0 200 200", no external dependencies).
Rules:
- Output ONLY the raw SVG element, nothing else. No markdown, no explanation.
- Use only CSS @keyframes inside a <style> tag within the SVG for animation.
- Make it abstract, atmospheric, unique — shapes, waves, particles, gradients that evoke the mood.
- Keep it under 80 lines. Make it beautiful.
- Use dark backgrounds. Vivid accent colors that match the mood.
- Every output must look completely different from the others.`

export default {
  name: 'VisualDemo',

  setup() {
    const title = ref(null)
    const cardEls = ref([])
    const loadingBars = ref([])

    // reactive array of card state
    const cards = reactive(
      MOODS.map(prompt => ({ prompt, svg: null, loading: false, error: false }))
    )

    // ── fetch SVG from Claude API ────────────────────────────
    const fetchSvg = async (index) => {
      const card = cards[index]
      card.loading = true
      card.error = false
      card.svg = null

      // animate loading bar
      const bar = loadingBars.value[index]
      if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 0.85, duration: 6, ease: 'power1.out' })
      }

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: LLM_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: `Music mood: "${card.prompt}"` }]
          })
        })

        const data = await res.json()
        const text = data.content?.find(b => b.type === 'text')?.text?.trim() ?? ''

        // extract SVG — strip markdown fences if any
        const svgMatch = text.match(/<svg[\s\S]*<\/svg>/i)
        const svg = svgMatch ? svgMatch[0] : text

        card.svg = svg
        card.loading = false

        // kill loading bar, entrance animation
        if (bar) gsap.killTweensOf(bar)

        await new Promise(r => setTimeout(r, 50)) // let v-html render
        const el = cardEls.value[index]
        if (el) {
          gsap.fromTo(el.querySelector('.card-svg-wrap'),
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
          )
        }
      } catch (e) {
        console.error('SVG fetch failed', e)
        card.loading = false
        card.error = true
        if (loadingBars.value[index]) gsap.killTweensOf(loadingBars.value[index])
      }
    }

    const regenerate = (i) => fetchSvg(i)

    // ── GSAP card entrance then stagger-load SVGs ────────────
    onMounted(() => {
      gsap.from(title.value, { y: -24, opacity: 0, duration: 0.7, ease: 'power3.out' })

      // stagger card shells in
      gsap.from(cardEls.value, {
        opacity: 0,
        scale: 0.85,
        y: 18,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        delay: 0.2,
        onComplete: () => {
          // load SVGs with staggered delay so we don't hammer the API
          cards.forEach((_, i) => {
            setTimeout(() => fetchSvg(i), i * 400)
          })
        }
      })

      // random subtle shake — same as Home.vue
      setInterval(() => {
        const i = Math.floor(Math.random() * cardEls.value.length)
        const el = cardEls.value[i]
        if (!el) return
        gsap.timeline()
          .to(el, { x: gsap.utils.random(-4, 4), y: gsap.utils.random(-3, 3), rotation: gsap.utils.random(-1, 1), duration: 0.09, ease: 'none' })
          .to(el, { x: gsap.utils.random(-4, 4), y: gsap.utils.random(-3, 3), rotation: gsap.utils.random(-1, 1), duration: 0.09, ease: 'none' })
          .to(el, { x: 0, y: 0, rotation: 0, duration: 0.25, ease: 'elastic.out(1, 0.5)' })
      }, gsap.utils.random(1800, 4000))
    })

    return { title, cards, cardEls, loadingBars, regenerate }
  }
}
</script>

<style scoped>
.visual-demo {
  min-height: 100vh;
  background: #101010;
  padding: 2.5rem;
  color: white;
}

.demo-title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.7);
  margin: 0 0 0.3rem;
  font-family: 'Kaylon', sans-serif;
}

.demo-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.25);
  letter-spacing: 2px;
  margin: 0 0 2rem;
  text-transform: uppercase;
}

.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
}

.effect-card {
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.effect-card:hover {
  border-color: rgba(255,255,255,0.18);
}

.effect-card:hover .card-label {
  opacity: 1;
}

/* SVG fills the card */
.card-svg-wrap {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.card-svg-wrap :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* loading */
.card-loading {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 0 0 2px;
}

.loading-bar {
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, #2196F3, #9336f7);
  transform-origin: left center;
  transform: scaleX(0);
  border-radius: 1px;
}

/* error */
.card-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255,71,87,0.6);
  font-size: 1.4rem;
}

.card-error-hint {
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
}

/* label */
.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 10px;
  font-size: 0.62rem;
  letter-spacing: 1px;
  text-transform: lowercase;
  color: rgba(255,255,255,0.5);
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  opacity: 0.6;
  transition: opacity 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>