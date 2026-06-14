function cssAccent() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

const GRID = 52
const MAX_PULSES = 18

export class CircuitBackground {
  constructor() {
    this.canvas = document.createElement('canvas')
    Object.assign(this.canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none' })
    document.body.prepend(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.segments = []
    this.pads = []
    this.pulses = []
    this.raf = null
    this.nextSpawn = 0
    this.onResize = () => { this.resize(); this.generate() }
    window.addEventListener('resize', this.onResize)
    this.resize()
    this.generate()
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  generate() {
    const cols = Math.ceil(this.canvas.width  / GRID) + 2
    const rows = Math.ceil(this.canvas.height / GRID) + 2
    this.segments = []
    this.pads = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * GRID, y = r * GRID
        if (c < cols - 1 && Math.random() < 0.55)
          this.segments.push({ x1:x, y1:y, x2:x+GRID, y2:y })
        if (r < rows - 1 && Math.random() < 0.44)
          this.segments.push({ x1:x, y1:y, x2:x, y2:y+GRID })
        if (Math.random() < 0.24)
          this.pads.push({ x, y })
      }
    }
    this.pulses = []
  }

  spawnPulse() {
    if (this.pulses.length >= MAX_PULSES || !this.segments.length) return
    const seg = this.segments[Math.floor(Math.random() * this.segments.length)]
    // Vary speed so pulses feel independent
    const fast = Math.random() < 0.35
    this.pulses.push({
      ...seg,
      t: 0,
      speed: fast
        ? 0.0018 + Math.random() * 0.002
        : 0.0006 + Math.random() * 0.001,
      wide: Math.random() < 0.25,  // occasional fat pulse
    })
  }

  animate() {
    const draw = (ts) => {
      this.raf = requestAnimationFrame(draw)
      const ctx = this.ctx
      const [r, g, b] = cssAccent()
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // Traces (slightly brighter base)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.13)`
      ctx.lineWidth = 1
      this.segments.forEach(s => {
        ctx.beginPath()
        ctx.moveTo(s.x1, s.y1)
        ctx.lineTo(s.x2, s.y2)
        ctx.stroke()
      })

      // Pads
      ctx.fillStyle = `rgba(${r},${g},${b},0.22)`
      this.pads.forEach(p => ctx.fillRect(p.x - 3, p.y - 3, 6, 6))

      // Spawn — faster interval
      if (ts > this.nextSpawn) {
        this.spawnPulse()
        this.nextSpawn = ts + 600 + Math.random() * 800
      }

      // Draw pulses
      this.pulses = this.pulses.filter(p => {
        p.t += p.speed
        if (p.t > 1) return false

        const px = p.x1 + (p.x2 - p.x1) * p.t
        const py = p.y1 + (p.y2 - p.y1) * p.t

        // Longer trail (start from segment origin)
        const trail = ctx.createLinearGradient(p.x1, p.y1, px, py)
        trail.addColorStop(0, `rgba(${r},${g},${b},0)`)
        trail.addColorStop(0.5, `rgba(${r},${g},${b},0.12)`)
        trail.addColorStop(1, `rgba(${r},${g},${b},0.55)`)
        ctx.strokeStyle = trail
        ctx.lineWidth = p.wide ? 3 : 1.8
        ctx.beginPath()
        ctx.moveTo(p.x1, p.y1)
        ctx.lineTo(px, py)
        ctx.stroke()

        // Outer glow ring
        const outerR = p.wide ? 10 : 7
        const outer = ctx.createRadialGradient(px, py, 0, px, py, outerR)
        outer.addColorStop(0, `rgba(${r},${g},${b},0.35)`)
        outer.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = outer
        ctx.beginPath()
        ctx.arc(px, py, outerR, 0, Math.PI * 2)
        ctx.fill()

        // Bright core head
        const coreR = p.wide ? 3.5 : 2.5
        ctx.fillStyle = `rgba(${r},${g},${b},1)`
        ctx.beginPath()
        ctx.arc(px, py, coreR, 0, Math.PI * 2)
        ctx.fill()

        return true
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
