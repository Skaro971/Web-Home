function cssAccent() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

const NODE_COUNT = 100
const MAX_DIST   = 180
const SPEED      = 0.10  // px per frame, very slow drift

export class NeuralBackground {
  constructor() {
    this.canvas = document.createElement('canvas')
    Object.assign(this.canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none' })
    document.body.prepend(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.nodes = []
    this.raf = null
    this.onResize = () => { this.resize(); this.scatter() }
    window.addEventListener('resize', this.onResize)
    this.resize()
    this.scatter()
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  scatter() {
    this.nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * this.canvas.width,
      y:  Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
    }))
  }

  animate() {
    const draw = () => {
      this.raf = requestAnimationFrame(draw)
      const ctx = this.ctx
      const [r, g, b] = cssAccent()
      const W = this.canvas.width
      const H = this.canvas.height
      ctx.clearRect(0, 0, W, H)

      // Move nodes — soft bounce off walls
      this.nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0)  { n.x = 0;  n.vx *= -1 }
        if (n.x > W)  { n.x = W;  n.vx *= -1 }
        if (n.y < 0)  { n.y = 0;  n.vy *= -1 }
        if (n.y > H)  { n.y = H;  n.vy *= -1 }
      })

      // Connections (computed live from current positions)
      ctx.lineWidth = 0.8
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const dx = this.nodes[i].x - this.nodes[j].x
          const dy = this.nodes[i].y - this.nodes[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < MAX_DIST) {
            // Fade connection alpha by distance
            const alpha = (1 - dist / MAX_DIST) * 0.12
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.beginPath()
            ctx.moveTo(this.nodes[i].x, this.nodes[i].y)
            ctx.lineTo(this.nodes[j].x, this.nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodes — two sizes for depth
      this.nodes.forEach((n, idx) => {
        const big    = idx % 7 === 0
        const radius = big ? 3.5 : 2
        const alpha  = big ? 0.35 : 0.22

        if (big) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8)
          grd.addColorStop(0, `rgba(${r},${g},${b},0.18)`)
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(n.x, n.y, 8, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2)
        ctx.fill()
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
