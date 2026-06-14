const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'

function cssAccent() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

export class MatrixRainBackground {
  constructor() {
    this.canvas = document.createElement('canvas')
    Object.assign(this.canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none' })
    document.body.prepend(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.cols = []
    this.lastTick = 0
    this.raf = null
    this.onResize = () => { this.resize(); this.initCols() }
    window.addEventListener('resize', this.onResize)
    this.resize()
    this.initCols()
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  initCols() {
    const colW = 18
    const count = Math.ceil(this.canvas.width / colW)
    this.cols = Array.from({ length: count }, (_, i) => ({
      x:     i * colW,
      y:     Math.random() * -this.canvas.height,
      speed: 28 + Math.random() * 40,   // px/s — slow
      chars: [],
      len:   8 + Math.floor(Math.random() * 12),
    }))
  }

  animate() {
    const draw = (ts) => {
      this.raf = requestAnimationFrame(draw)
      const dt = Math.min(ts - this.lastTick, 50) / 1000
      this.lastTick = ts

      const ctx = this.ctx
      const [r, g, b] = cssAccent()

      // Fade trail (semi-transparent clear)
      ctx.fillStyle = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim().replace(/^#/, '') && '0,0,0'},0)`
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      ctx.font = '14px "Courier New", monospace'

      this.cols.forEach(col => {
        col.y += col.speed * dt

        // Reset column when it goes off screen
        if (col.y > this.canvas.height + col.len * 18) {
          col.y = -col.len * 18 - Math.random() * this.canvas.height * 0.5
          col.speed = 28 + Math.random() * 40
          col.len = 8 + Math.floor(Math.random() * 12)
        }

        // Draw trail characters
        for (let i = 0; i < col.len; i++) {
          const cy = col.y - i * 18
          if (cy < 0 || cy > this.canvas.height) continue

          const progress = i / col.len
          let alpha
          if (i === 0) {
            alpha = 0.9 // head: bright
          } else {
            alpha = (1 - progress) * 0.25 // tail: fading
          }

          const char = CHARS[Math.floor(Math.random() * CHARS.length)]
          ctx.fillStyle = i === 0
            ? `rgba(255,255,255,${alpha})`
            : `rgba(${r},${g},${b},${alpha})`
          ctx.fillText(char, col.x, cy)
        }
      })
    }
    this.raf = requestAnimationFrame(draw)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.canvas.remove()
  }
}
