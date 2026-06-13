const engines = {
  google:     q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  duckduckgo: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  brave:      q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
}

const DEFAULT_ENGINE = 'google'

export function initSearch(container) {
  container.innerHTML = `
    <div class="search">
      <form class="search__form" id="search-form">
        <input
          class="search__input"
          id="search-input"
          type="text"
          placeholder="Rechercher..."
          autocomplete="off"
          autofocus
        />
        <select class="search__engine" id="search-engine">
          <option value="brave">Brave</option>
          <option value="google">Google</option>
          <option value="duckduckgo">DuckDuckGo</option>
        </select>
      </form>
    </div>
  `

  const form   = container.querySelector('#search-form')
  const input  = container.querySelector('#search-input')
  const select = container.querySelector('#search-engine')

  select.value = localStorage.getItem('search-engine') || DEFAULT_ENGINE

  select.addEventListener('change', () => {
    localStorage.setItem('search-engine', select.value)
  })

  form.addEventListener('submit', e => {
    e.preventDefault()
    const query = input.value.trim()
    if (!query) return
    const engine = select.value
    window.open(engines[engine](query), '_self')
  })
}