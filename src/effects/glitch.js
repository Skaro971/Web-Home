import './glitch.css'

function trigger(el) {
  if (el.classList.contains('is-glitching')) return
  el.classList.add('is-glitching')
  setTimeout(() => el.classList.remove('is-glitching'), 500)
}

export function initGlitch(selectors) {
  const elements = selectors
    .map(s => document.querySelector(s))
    .filter(Boolean)

  function schedule() {
    const delay = 5000 + Math.random() * 4000
    setTimeout(() => {
      elements.forEach(trigger)
      schedule()
    }, delay)
  }

  schedule()
}
