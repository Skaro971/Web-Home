const MODES = {
  work:       { label: 'FOCUS',        duration: 25 * 60 },
  shortBreak: { label: 'SHORT BREAK',  duration:  5 * 60 },
  longBreak:  { label: 'LONG BREAK',   duration: 15 * 60 },
}

export function initPomodoro(container) {
  let mode      = 'work'
  let remaining = MODES.work.duration
  let running   = false
  let sessions  = 0
  let interval  = null

  container.innerHTML = `
    <div class="pomodoro">
      <div class="pomodoro__header">
        <span class="pomodoro__label" id="pomo-label">FOCUS</span>
        <span class="pomodoro__sessions" id="pomo-sessions">● ● ● ●</span>
      </div>
      <div class="pomodoro__time" id="pomo-time">25:00</div>
      <div class="pomodoro__track">
        <div class="pomodoro__bar" id="pomo-bar"></div>
      </div>
      <div class="pomodoro__controls">
        <button class="pomodoro__btn" id="pomo-reset" title="Réinitialiser">↺</button>
        <button class="pomodoro__btn pomodoro__btn--main" id="pomo-toggle">START</button>
        <button class="pomodoro__btn" id="pomo-skip" title="Passer">⟶</button>
      </div>
    </div>
  `

  const timeEl     = container.querySelector('#pomo-time')
  const labelEl    = container.querySelector('#pomo-label')
  const sessionsEl = container.querySelector('#pomo-sessions')
  const barEl      = container.querySelector('#pomo-bar')
  const toggleBtn  = container.querySelector('#pomo-toggle')
  const resetBtn   = container.querySelector('#pomo-reset')
  const skipBtn    = container.querySelector('#pomo-skip')

  function fmt(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  function dots() {
    const done = sessions % 4
    return Array.from({ length: 4 }, (_, i) => i < done ? '◆' : '◇').join(' ')
  }

  function render() {
    const total = MODES[mode].duration
    timeEl.textContent     = fmt(remaining)
    labelEl.textContent    = MODES[mode].label
    sessionsEl.textContent = dots()
    toggleBtn.textContent  = running ? 'PAUSE' : 'START'
    barEl.style.width      = `${((total - remaining) / total) * 100}%`

    const colors = { work: 'var(--color-accent)', shortBreak: 'var(--color-accent-3)', longBreak: 'var(--color-accent-2)' }
    barEl.style.background    = colors[mode]
    labelEl.style.color       = colors[mode]
    timeEl.style.color        = colors[mode]
    timeEl.style.textShadow   = mode === 'work'
      ? '0 0 10px rgba(0,207,255,0.5)'
      : mode === 'shortBreak'
        ? '0 0 10px rgba(160,32,240,0.5)'
        : '0 0 10px rgba(255,0,68,0.5)'
  }

  function nextMode() {
    if (mode === 'work') {
      sessions++
      mode = sessions % 4 === 0 ? 'longBreak' : 'shortBreak'
    } else {
      mode = 'work'
    }
    remaining = MODES[mode].duration
    running   = false
    clearInterval(interval)
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro — ' + MODES[mode].label)
    }
    render()
  }

  toggleBtn.addEventListener('click', () => {
    running = !running
    if (running) {
      Notification.requestPermission()
      interval = setInterval(() => {
        if (remaining <= 0) { nextMode(); return }
        remaining--
        render()
      }, 1000)
    } else {
      clearInterval(interval)
    }
    render()
  })

  resetBtn.addEventListener('click', () => {
    clearInterval(interval)
    running   = false
    remaining = MODES[mode].duration
    render()
  })

  skipBtn.addEventListener('click', () => {
    clearInterval(interval)
    nextMode()
  })

  render()
}
