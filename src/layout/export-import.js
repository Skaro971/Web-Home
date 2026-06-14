import './export-import.css'

export function initExportImport() {
  const bar = document.createElement('div')
  bar.id = 'export-import-bar'

  const exportBtn = document.createElement('button')
  exportBtn.className = 'ctrl-btn'
  exportBtn.textContent = 'EXPORT'

  // Import via hidden file input triggered by a label styled as button
  const importLabel = document.createElement('label')
  importLabel.className = 'ctrl-btn'
  importLabel.textContent = 'IMPORT'

  const importInput = document.createElement('input')
  importInput.type   = 'file'
  importInput.accept = '.json'
  importInput.style.display = 'none'
  importLabel.appendChild(importInput)

  bar.appendChild(exportBtn)
  bar.appendChild(importLabel)
  document.body.appendChild(bar)

  exportBtn.addEventListener('click', () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `homepage-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  })

  importInput.addEventListener('change', e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        localStorage.clear()
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v))
        location.reload()
      } catch {
        alert('Fichier de configuration invalide.')
      }
    }
    reader.readAsText(file)
    importInput.value = ''
  })
}
