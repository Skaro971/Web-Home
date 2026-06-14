import './boot.css'

// Targets the inner .grid-stack-item-content to avoid gridstack transform conflicts
export function bootSequence(ids, { baseDelay = 200, step = 110 } = {}) {
  ids.forEach(id => {
    const el = document.querySelector(`#${id} .grid-stack-item-content`)
    if (el) el.classList.add('boot-hidden')
  })

  ids.forEach((id, i) => {
    const el = document.querySelector(`#${id} .grid-stack-item-content`)
    if (!el) return
    setTimeout(() => {
      el.classList.remove('boot-hidden')
      el.classList.add('boot-reveal')
    }, baseDelay + i * step)
  })
}
