export function initClock(container) {
    container.innerHTML = `
    <div class="clock">
        <div class="clock__time" id="clock-time"></div>
        <div class="clock__date" id="clock-date"></div>
    </div>
    `

    const timeEl = container.querySelector('#clock-time')
    const dateEl = container.querySelector('#clock-date')

    function tick() {
        const now = new Date()
        timeEl.textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        dateEl.textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  tick()
  setInterval(tick, 1000)
}