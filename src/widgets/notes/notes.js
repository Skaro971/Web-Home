const STORAGE_KEY = 'notes'

export function initNotes(container) {
  const saved = localStorage.getItem(STORAGE_KEY) ?? ''

  container.innerHTML = `
    <div class="notes">
      <div class="notes__header">
        <span class="notes__title">Notes</span>
        <span class="notes__status" id="notes-status"></span>
      </div>
      <textarea class="notes__textarea" id="notes-textarea" placeholder="Tes notes ici...">${saved}</textarea>
    </div>
  `

  const textarea = container.querySelector('#notes-textarea')
  const status   = container.querySelector('#notes-status')
  let   timer    = null

  textarea.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, textarea.value)
      status.textContent = 'Sauvegardé'
      setTimeout(() => { status.textContent = '' }, 1500)
    }, 500)
  })
}
