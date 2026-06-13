import { links as defaultLinks } from '../../config/links.js'
import { openEditor } from './quick-links-editor.js'

const STORAGE_KEY = 'quick-links'

function loadLinks() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : defaultLinks
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
}

function render(container, links) {
  container.innerHTML = `
    <div class="quick-links-wrapper">
      <div class="quick-links">
        ${links.map(link => `
          <a class="quick-links__item" href="${link.url}" target="_blank" rel="noopener">
            <span class="quick-links__icon">${link.icon}</span>
            <span class="quick-links__label">${link.label}</span>
          </a>
        `).join('')}
      </div>
      <button class="quick-links__edit-btn" id="ql-open-editor">Modifier</button>
    </div>
  `

  container.querySelector('#ql-open-editor').addEventListener('click', () => {
    openEditor(loadLinks(), updated => {
      saveLinks(updated)
      render(container, updated)
    })
  })
}

export function initQuickLinks(container) {
  render(container, loadLinks())
}
