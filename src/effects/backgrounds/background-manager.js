import { CircuitBackground }    from './circuit.js'
import { TopographyBackground } from './topography.js'
import { MatrixRainBackground }  from './matrix-rain.js'
import { NeuralBackground }      from './neural.js'

const BG_CLASSES = ['bg-grid', 'bg-scanlines']
const BG_CANVAS  = {
  circuit:    CircuitBackground,
  topography: TopographyBackground,
  matrix:     MatrixRainBackground,
  neural:     NeuralBackground,
}

let current      = null
let glitchTimer  = null

function setParticlesVisible(visible) {
  const el = document.getElementById('particles-canvas')
  if (el) el.style.display = visible ? '' : 'none'
}

function stopGlitch() {
  clearTimeout(glitchTimer)
  glitchTimer = null
  document.body.classList.remove('scanlines-flash')
}

function scheduleGlitch() {
  const delay = 4000 + Math.random() * 5000  // 4–9s
  glitchTimer = setTimeout(() => {
    document.body.classList.add('scanlines-flash')
    // Remove after animation completes (600ms)
    setTimeout(() => {
      document.body.classList.remove('scanlines-flash')
      scheduleGlitch()
    }, 600)
  }, delay)
}

export function applyBackground(name) {
  if (current) { current.destroy(); current = null }
  BG_CLASSES.forEach(c => document.body.classList.remove(c))
  stopGlitch()

  setParticlesVisible(name === 'grid')

  if (name === 'grid' || name === 'scanlines') {
    document.body.classList.add(`bg-${name}`)
    if (name === 'scanlines') scheduleGlitch()
  } else if (BG_CANVAS[name]) {
    current = new BG_CANVAS[name]()
  }

  localStorage.setItem('background', name)
}

export function initBackground() {
  const name = localStorage.getItem('background') || 'grid'
  applyBackground(name)
  return name
}
