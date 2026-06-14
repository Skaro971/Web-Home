// CSS
import './styles/base.css'
import './styles/layout.css'
import './widgets/clock/clock.css'
import './widgets/quick-links/quick-links.css'
import './widgets/search/search.css'
import './widgets/weather/weather.css'
import './widgets/notes/notes.css'
import './widgets/pomodoro/pomodoro.css'
import './widgets/todo/todo.css'
import './widgets/shortcuts/shortcuts.css'

// Widgets
import { initClock }      from './widgets/clock/clock.js'
import { initQuickLinks } from './widgets/quick-links/quick-links.js'
import { initSearch }     from './widgets/search/search.js'
import { initWeather }    from './widgets/weather/weather.js'
import { initNotes }      from './widgets/notes/notes.js'
import { initPomodoro }   from './widgets/pomodoro/pomodoro.js'
import { initTodo }       from './widgets/todo/todo.js'
import { initShortcuts }  from './widgets/shortcuts/shortcuts.js'
import { initRss }        from './widgets/rss/rss.js'

// Layout & UI
import { initLayout }        from './layout/layout-manager.js'
import { initFocusMode }     from './layout/focus-mode.js'
import { initSwitcher }      from './ui/switcher.js'
import { initExportImport }  from './layout/export-import.js'

// Effects
import { initParticles }  from './effects/particles.js'
import { initGlitch }     from './effects/glitch.js'
import { bootSequence }   from './effects/boot.js'
import { initBackground } from './effects/backgrounds/background-manager.js'
import { initPalette }    from './config/palettes.js'
import { applyDefaults } from './config/defaults.js'

// Helper: get the widget's inner content div
function slot(id) {
  return document.querySelector(`#${id} .grid-stack-item-content`)
}

// Seed localStorage with bundled defaults on first install
applyDefaults()

// Apply saved palette & background before anything renders
initPalette()
initBackground()

// Render widgets into their content slots
initClock(slot('widget-clock'))
initWeather(slot('widget-weather'))
initSearch(slot('widget-search'))
initQuickLinks(slot('widget-quick-links'))
initNotes(slot('widget-notes'))
initPomodoro(slot('widget-pomodoro'))
initTodo(slot('widget-todo'))
initShortcuts(slot('widget-shortcuts'))
initRss(slot('widget-rss'))

// Layout (gridstack) + controls
const ctrlBar = document.getElementById('ctrl-bar')
const grid    = initLayout(ctrlBar)
initFocusMode(grid, ctrlBar)
initSwitcher(ctrlBar)
initExportImport()

// Visual effects
initParticles()
initGlitch(['.clock__time'])
bootSequence([
  'widget-clock',
  'widget-search',
  'widget-weather',
  'widget-quick-links',
  'widget-pomodoro',
  'widget-notes',
  'widget-shortcuts',
  'widget-todo',
  'widget-rss',
])
