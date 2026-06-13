import './widgets/clock/clock.css'
import './widgets/quick-links/quick-links.css'
import './widgets/search/search.css'
import './widgets/weather/weather.css'
import './widgets/notes/notes.css'

import { initClock }      from './widgets/clock/clock.js'
import { initQuickLinks } from './widgets/quick-links/quick-links.js'
import { initSearch }     from './widgets/search/search.js'
import { initWeather }    from './widgets/weather/weather.js'
import { initNotes }      from './widgets/notes/notes.js'

initSearch(document.getElementById('widget-search'))
initClock(document.getElementById('widget-clock'))
initWeather(document.getElementById('widget-weather'))
initQuickLinks(document.getElementById('widget-quick-links'))
initNotes(document.getElementById('widget-notes'))
