import './shortcuts-editor.css'

export function openShortcutsEditor(items, onSave) {
  let current = items.map(i => ({ ...i }))

  const overlay = document.createElement('div')
  overlay.className = 'sc-editor-overlay'
  overlay.innerHTML = `
    <div class="sc-editor">
      <div class="sc-editor__header">
        <h2 class="sc-editor__title">Raccourcis clavier</h2>
        <button class="sc-editor__close" id="sc-close">&times;</button>
      </div>
      <ul class="sc-editor__list" id="sc-list"></ul>
      <form class="sc-editor__form" id="sc-form">
        <p class="sc-editor__form-title">Ajouter un raccourci</p>
        <div class="sc-editor__fields">
          <input class="sc-editor__input" id="sc-cat"  type="text" placeholder="Catégorie" required />
          <input class="sc-editor__input" id="sc-keys" type="text" placeholder="Ctrl+K" required />
          <input class="sc-editor__input" id="sc-desc" type="text" placeholder="Description" required />
          <button class="sc-editor__btn sc-editor__btn--add" type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(overlay)

  function renderList() {
    const list = overlay.querySelector('#sc-list')
    list.innerHTML = current.map((item, i) => `
      <li class="sc-editor__item">
        <span class="sc-editor__item-cat">${item.category}</span>
        <span class="sc-editor__item-keys">${item.keys}</span>
        <span class="sc-editor__item-desc">${item.description}</span>
        <div class="sc-editor__item-actions">
          <button class="sc-editor__btn" data-action="up"     data-index="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="sc-editor__btn" data-action="down"   data-index="${i}" ${i === current.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="sc-editor__btn sc-editor__btn--delete" data-action="delete" data-index="${i}">✕</button>
        </div>
      </li>
    `).join('')

    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx    = parseInt(btn.dataset.index)
        const action = btn.dataset.action
        if (action === 'up' && idx > 0) {
          [current[idx - 1], current[idx]] = [current[idx], current[idx - 1]]
        } else if (action === 'down' && idx < current.length - 1) {
          [current[idx], current[idx + 1]] = [current[idx + 1], current[idx]]
        } else if (action === 'delete') {
          current.splice(idx, 1)
        }
        renderList()
      })
    })
  }

  renderList()

  overlay.querySelector('#sc-form').addEventListener('submit', e => {
    e.preventDefault()
    current.push({
      category:    overlay.querySelector('#sc-cat').value.trim(),
      keys:        overlay.querySelector('#sc-keys').value.trim(),
      description: overlay.querySelector('#sc-desc').value.trim(),
    })
    renderList()
    e.target.reset()
  })

  function close() {
    onSave(current)
    overlay.remove()
  }

  overlay.querySelector('#sc-close').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })
}
