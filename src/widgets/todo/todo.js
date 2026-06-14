const STORAGE_KEY = 'todo-items'

function load() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function initTodo(container) {
  let items = load()

  container.innerHTML = `
    <div class="todo">
      <div class="todo__header">
        <span class="todo__title">TODO</span>
        <span class="todo__count" id="todo-count"></span>
      </div>
      <form class="todo__form" id="todo-form">
        <input class="todo__input" id="todo-input" type="text" placeholder="Ajouter une tâche..." autocomplete="off" />
      </form>
      <ul class="todo__list" id="todo-list"></ul>
    </div>
  `

  const listEl  = container.querySelector('#todo-list')
  const form    = container.querySelector('#todo-form')
  const input   = container.querySelector('#todo-input')
  const countEl = container.querySelector('#todo-count')

  function render() {
    const remaining = items.filter(i => !i.done).length
    countEl.textContent = `${remaining} / ${items.length}`

    listEl.innerHTML = items.map((item, i) => `
      <li class="todo__item ${item.done ? 'todo__item--done' : ''}">
        <button class="todo__check" data-action="toggle" data-index="${i}">${item.done ? '◆' : ''}</button>
        <span class="todo__text">${item.text}</span>
        <button class="todo__delete" data-action="delete" data-index="${i}">✕</button>
      </li>
    `).join('')

    listEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index)
        if (btn.dataset.action === 'toggle') {
          items[idx].done = !items[idx].done
        } else {
          items.splice(idx, 1)
        }
        save(items)
        render()
      })
    })
  }

  form.addEventListener('submit', e => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return
    items.push({ text, done: false })
    save(items)
    input.value = ''
    render()
  })

  render()
}
