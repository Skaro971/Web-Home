import './rss-editor.css'

export function openRssEditor(feeds, onSave) {
  // Remove existing editor if any
  document.getElementById('rss-editor-overlay')?.remove()

  let current = feeds.map(f => ({ ...f }))

  const overlay = document.createElement('div')
  overlay.id = 'rss-editor-overlay'

  function render() {
    overlay.innerHTML = `
      <div class="rss-editor">
        <div class="rss-editor__header">
          <span class="rss-editor__title">GÉRER LES FLUX RSS</span>
          <button class="rss-editor__close" id="rss-ed-close">✕</button>
        </div>

        <div class="rss-editor__list" id="rss-ed-list">
          ${current.length === 0
            ? `<p class="rss-editor__none">Aucun flux — ajoutez-en un ci-dessous.</p>`
            : current.map((f, i) => `
              <div class="rss-editor__feed">
                <div class="rss-editor__feed-info">
                  <span class="rss-editor__feed-name">${f.name}</span>
                  <span class="rss-editor__feed-url">${f.url}</span>
                </div>
                <button class="rss-editor__remove" data-i="${i}">✕</button>
              </div>
            `).join('')
          }
        </div>

        <form class="rss-editor__form" id="rss-ed-form">
          <input class="rss-editor__input" type="text"   name="name" placeholder="Nom du flux"  required />
          <input class="rss-editor__input" type="url"    name="url"  placeholder="URL du flux RSS" required />
          <button class="rss-editor__add" type="submit">AJOUTER</button>
        </form>

        <div class="rss-editor__footer">
          <button class="rss-editor__save" id="rss-ed-save">ENREGISTRER</button>
        </div>
      </div>
    `

    overlay.querySelectorAll('.rss-editor__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        current.splice(Number(btn.dataset.i), 1)
        render()
      })
    })

    overlay.querySelector('#rss-ed-close').addEventListener('click', () => overlay.remove())

    overlay.querySelector('#rss-ed-form').addEventListener('submit', e => {
      e.preventDefault()
      const fd  = new FormData(e.target)
      const name = fd.get('name').trim()
      const url  = fd.get('url').trim()
      if (!name || !url) return
      current.push({ name, url })
      render()
    })

    overlay.querySelector('#rss-ed-save').addEventListener('click', () => {
      onSave(current)
      overlay.remove()
    })

    // Close on backdrop click
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove()
    })
  }

  render()
  document.body.appendChild(overlay)
}
