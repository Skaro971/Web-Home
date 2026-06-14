import './focus-mode.css'

const FOCUS_HIDDEN = [
  'widget-shortcuts',
  'widget-quick-links',
  'widget-notes',
  'widget-weather',
  'widget-todo',
  'widget-rss',
]

let active      = false
let savedStyle  = null   // gridstack's inline styles before we override them

export function initFocusMode(grid, ctrlBar) {
  const btn = document.createElement('button')
  btn.className = 'ctrl-btn'
  btn.textContent = 'FOCUS'
  ctrlBar.insertBefore(btn, ctrlBar.firstChild)

  btn.addEventListener('click', () => toggle(btn))

  document.addEventListener('keydown', e => {
    if (
      e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
    ) toggle(btn)
  })
}

function toggle(btn) {
  active ? exit(btn) : enter(btn)
}

function enter(btn) {
  active = true

  const pomodoro = document.getElementById('widget-pomodoro')
  const weather  = document.getElementById('widget-weather')

  // Hide non-focus widgets (gridstack engine untouched — no recompact with float:true)
  FOCUS_HIDDEN.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.style.visibility = 'hidden'
  })

  // Save gridstack's current inline styles BEFORE overriding them
  savedStyle = {
    position: pomodoro.style.position,
    left:     pomodoro.style.left,
    top:      pomodoro.style.top,
    width:    pomodoro.style.width,
    height:   pomodoro.style.height,
    zIndex:   pomodoro.style.zIndex,
  }

  // Overlay pomodoro on top of weather using fixed positioning
  // No gridstack engine changes → no drift on repeated toggles
  const wr = weather.getBoundingClientRect()
  const pr = pomodoro.getBoundingClientRect()
  Object.assign(pomodoro.style, {
    position: 'fixed',
    left:     wr.left   + 'px',
    top:      wr.top    + 'px',
    width:    pr.width  + 'px',   // keep pomodoro's own width, only move it
    height:   pr.height + 'px',
    zIndex:   '50',
  })

  btn.classList.add('is-active')
}

function exit(btn) {
  active = false

  const pomodoro = document.getElementById('widget-pomodoro')

  // Restore gridstack's exact inline styles (not just clear — clearing loses the values)
  if (savedStyle) {
    Object.assign(pomodoro.style, savedStyle)
    savedStyle = null
  }

  FOCUS_HIDDEN.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.style.visibility = ''
  })

  btn.classList.remove('is-active')
}
