function cssAccent3() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-3').trim()
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

export class TopographyBackground {
  constructor() {
    this.canvas = document.createElement('canvas')
    Object.assign(this.canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none' })
    document.body.prepend(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.phase = 0
    this.raf = null
    this.onResize = () => this.resize()
    window.addEventListener('resize', this.onResize)
    this.resize()
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  animate() {
    const draw = () => {
      this.raf = requestAnimationFrame(draw)
      const ctx = this.ctx
      const [r, g, b] = cssAccent3()
      const H = this.canvas.height
      const W = this.canvas.width
      ctx.clearRect(0, 0, W, H)

      this.phase += 0.0008  // slower, more majestic

      // Lines spread from ~40% height down to bottom — horizon feel
      const horizonY = H * 0.38
      const step     = 55   // wide spacing → fewer, more dramatic lines
      const total    = Math.ceil((H - horizonY) / step) + 2

      for (let i = 0; i < total; i++) {
        const yBase = horizonY + i * step
        const isMajor = i % 3 === 0

        // Lines closer to horizon are more faint (perspective)
        // Lines further down are bolder (foreground)
        const depth = Math.min(i / (total - 1), 1)  // 0=horizon, 1=bottom
        const alpha = isMajor
          ? 0.15 + depth * 0.45
          : 0.06 + depth * 0.22
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth   = isMajor ? 1.4 + depth * 0.8 : 0.7 + depth * 0.5

        // Large amplitude waves — "ocean swell" feel
        // Amplitude grows toward foreground (depth) for perspective
        const amp1 = (30 + depth * 70)
        const amp2 = (12 + depth * 30)
        const amp3 = (5  + depth * 12)

        ctx.beginPath()
        for (let x = 0; x <= W; x += 2) {
          const y = yBase
            + amp1 * Math.sin(x * 0.004 + this.phase + i * 0.4)
            + amp2 * Math.sin(x * 0.011 + this.phase * 1.3 + i * 0.7)
            + amp3 * Math.sin(x * 0.028 + this.phase * 0.6 + i * 1.1)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }
    this.raf = requestAnimationFrame(draw)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.canvas.remove()
  }
}
