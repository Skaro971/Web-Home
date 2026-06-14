import './quick-links-editor.css'
import { faviconUrl } from './quick-links.js'

export function openEditor(links, onSave) {
  let current = links.map(l => ({ ...l }))

  const overlay = document.createElement('div')
  overlay.className = 'ql-editor-overlay'
  overlay.innerHTML = `
    <div class="ql-editor">
      <div class="ql-editor__header">
        <h2 class="ql-editor__title">Liens rapides</h2>
        <button class="ql-editor__close" id="ql-close">&times;</button>
      </div>
      <ul class="ql-editor__list" id="ql-list"></ul>
      <form class="ql-editor__form" id="ql-form">
        <p class="ql-editor__form-title">Ajouter un lien</p>
        <div class="ql-editor__fields">
          <input class="ql-editor__input" id="ql-label" type="text" placeholder="Nom" required />
          <input class="ql-editor__input" id="ql-url"   type="url" placeholder="https://..." required />
          <button class="ql-editor__btn ql-editor__btn--add" type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(overlay)

  function renderList() {
    const list = overlay.querySelector('#ql-list')
    list.innerHTML = current.map((link, i) => `
      <li class="ql-editor__item">
        <span class="ql-editor__item-icon">
          <img src="${faviconUrl(link.url)}" alt="${link.label}" width="16" height="16"
               onerror="this.style.display='none'" />
        </span>
        <span class="ql-editor__item-label">${link.label}</span>
        <span class="ql-editor__item-url">${link.url}</span>
        <div class="ql-editor__item-actions">
          <button class="ql-editor__btn" data-action="up"     data-index="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="ql-editor__btn" data-action="down"   data-index="${i}" ${i === current.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="ql-editor__btn ql-editor__btn--delete" data-action="delete" data-index="${i}">✕</button>
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

  overlay.querySelector('#ql-form').addEventListener('submit', e => {
    e.preventDefault()
    const label = overlay.querySelector('#ql-label').value.trim()
    const url   = overlay.querySelector('#ql-url').value.trim()
    current.push({ label, url })
    renderList()
    e.target.reset()
  })

  function close() {
    onSave(current)
    overlay.remove()
  }

  overlay.querySelector('#ql-close').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })
}
