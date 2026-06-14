import './rss.css'
import { openRssEditor } from './rss-editor.js'

const FEEDS_KEY  = 'rss-feeds'
const CACHE_KEY  = 'rss-cache'
const REFRESH_MS = 30 * 60 * 1000

const DEFAULT_FEEDS = [
  { name: 'Le Monde',      url: 'https://www.lemonde.fr/rss/une.xml' },
  { name: 'Hacker News',   url: 'https://hnrss.org/frontpage' },
  { name: 'The Verge',     url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Dev.to',        url: 'https://dev.to/feed' },
]

export function loadFeeds()  { return JSON.parse(localStorage.getItem(FEEDS_KEY) || JSON.stringify(DEFAULT_FEEDS)) }
export function saveFeeds(f) { localStorage.setItem(FEEDS_KEY, JSON.stringify(f)) }

function loadCache()  { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') }
function saveCache(c) { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) }

async function fetchFeed(feed) {
  try {
    const res  = await fetch(feed.url)
    const text = await res.text()
    const doc  = new DOMParser().parseFromString(text, 'text/xml')

    // RSS 2.0
    const items = [...doc.querySelectorAll('item')].map(el => ({
      title:  el.querySelector('title')?.textContent?.trim() || '(sans titre)',
      link:   el.querySelector('link')?.textContent?.trim()  || '#',
      date:   new Date(el.querySelector('pubDate')?.textContent || 0).getTime(),
      source: feed.name,
    }))
    if (items.length) return items

    // Atom
    return [...doc.querySelectorAll('entry')].map(el => ({
      title:  el.querySelector('title')?.textContent?.trim() || '(sans titre)',
      link:   (el.querySelector('link')?.getAttribute('href') || el.querySelector('link')?.textContent?.trim() || '#'),
      date:   new Date(el.querySelector('updated,published')?.textContent || 0).getTime(),
      source: feed.name,
    }))
  } catch {
    return []
  }
}

async function refreshAll(feeds) {
  const cache = loadCache()
  await Promise.all(feeds.map(async f => {
    const items = await fetchFeed(f)
    if (items.length) cache[f.url] = items
  }))
  saveCache(cache)
  return cache
}

function allItems(cache, feeds) {
  const activeUrls = new Set(feeds.map(f => f.url))
  return Object.entries(cache)
    .filter(([url]) => activeUrls.has(url))
    .flatMap(([, items]) => items)
    .sort((a, b) => b.date - a.date)
    .slice(0, 60)
}

function formatDate(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}min`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function renderItems(list, items, feeds) {
  if (!feeds.length) {
    list.innerHTML = `<p class="rss__empty">Aucun flux configuré.<br>Cliquez sur GÉRER pour en ajouter.</p>`
    return
  }
  if (!items.length) {
    list.innerHTML = `<p class="rss__empty">Aucun article — rafraîchissement en cours…</p>`
    return
  }
  list.innerHTML = items.map(item => `
    <a class="rss__item" href="${item.link}" target="_blank" rel="noopener">
      <span class="rss__source">${item.source}</span>
      <span class="rss__title">${item.title}</span>
      <span class="rss__date">${formatDate(item.date)}</span>
    </a>
  `).join('')
}

export function initRss(container) {
  container.innerHTML = `
    <div class="rss-widget">
      <div class="rss__header">
        <span class="rss__heading">RSS</span>
        <div class="rss__actions">
          <button class="rss__btn" id="rss-refresh" title="Rafraîchir">↻</button>
          <button class="rss__btn" id="rss-manage">GÉRER</button>
        </div>
      </div>
      <div class="rss__list" id="rss-list"></div>
      <div class="rss__footer">
        <span id="rss-updated"></span>
      </div>
    </div>
  `

  const list       = container.querySelector('#rss-list')
  const updatedEl  = container.querySelector('#rss-updated')
  const refreshBtn = container.querySelector('#rss-refresh')
  const manageBtn  = container.querySelector('#rss-manage')

  let timer = null

  async function refresh() {
    const feeds = loadFeeds()
    refreshBtn.classList.add('rss__btn--spinning')
    const cache = await refreshAll(feeds)
    refreshBtn.classList.remove('rss__btn--spinning')
    renderItems(list, allItems(cache, feeds), feeds)
    updatedEl.textContent = `MAJ ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    scheduleNext()
  }

  function scheduleNext() {
    clearTimeout(timer)
    timer = setTimeout(refresh, REFRESH_MS)
  }

  function renderFromCache() {
    const feeds = loadFeeds()
    const cache = loadCache()
    renderItems(list, allItems(cache, feeds), feeds)
  }

  refreshBtn.addEventListener('click', refresh)

  manageBtn.addEventListener('click', () => {
    openRssEditor(loadFeeds(), updated => {
      saveFeeds(updated)
      refresh()
    })
  })

  // Initial render from cache, then refresh in background
  renderFromCache()
  refresh()
}
