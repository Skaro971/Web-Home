import { shortcuts as defaultShortcuts } from '../../config/shortcuts.js'
import { openShortcutsEditor } from './shortcuts-editor.js'

const STORAGE_KEY = 'shortcuts'

function load() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : defaultShortcuts
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    ;(acc[item[key]] ??= []).push(item)
    return acc
  }, {})
}

function render(container, items) {
  const groups = groupBy(items, 'category')

  container.innerHTML = `
    <div class="shortcuts">
      <div class="shortcuts__header">
        <span class="shortcuts__title">RACCOURCIS</span>
        <button class="shortcuts__edit-btn" id="sc-open-editor">Modifier</button>
      </div>
      <div class="shortcuts__body">
        ${Object.entries(groups).map(([cat, entries]) => `
          <div class="shortcuts__group">
            <div class="shortcuts__cat">${cat}</div>
            ${entries.map(e => `
              <div class="shortcuts__row">
                <span class="shortcuts__desc">${e.description}</span>
                <kbd class="shortcuts__keys">${e.keys}</kbd>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `

  container.querySelector('#sc-open-editor').addEventListener('click', () => {
    openShortcutsEditor(load(), updated => {
      save(updated)
      render(container, updated)
    })
  })
}

export function initShortcuts(container) {
  render(container, load())
}
