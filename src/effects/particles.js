import './particles.css'

function cssRgb(varName) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

export function initParticles() {
  const canvas = document.createElement('canvas')
  canvas.id = 'particles-canvas'
  document.body.insertBefore(canvas, document.body.firstChild)

  const ctx   = canvas.getContext('2d')
  const COUNT = 55
  const DIST  = 130

  let particles = []

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }

  function make() {
    const rnd = Math.random()
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      r:    Math.random() * 1.2 + 0.4,
      // role: 0=accent(50%) 1=accent-3(20%) 2=accent-2(30%)
      role: rnd < 0.5 ? 0 : rnd < 0.7 ? 1 : 2,
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const c0 = cssRgb('--color-accent')
    const c1 = cssRgb('--color-accent-3')
    const c2 = cssRgb('--color-accent-2')
    const colors = [c0, c1, c2]

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      const [r, g, b] = colors[p.role]
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.55)`
      ctx.fill()

      for (let j = i + 1; j < particles.length; j++) {
        const p2   = particles[j]
        const dx   = p.x - p2.x
        const dy   = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < DIST) {
          const alpha = (1 - dist / DIST) * 0.12
          const [lr, lg, lb] = c0
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    requestAnimationFrame(draw)
  }

  resize()
  particles = Array.from({ length: COUNT }, make)
  draw()

  window.addEventListener('resize', () => {
    resize()
    particles = Array.from({ length: COUNT }, make)
  })
}
