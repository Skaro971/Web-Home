export const PALETTES = {
  cyberpunk: {
    '--color-bg':         '#020408',
    '--color-surface':    '#050d1a',
    '--color-border':     '#0d2545',
    '--color-text':       '#c8deff',
    '--color-text-muted': '#2e5480',
    '--color-accent':     '#00cfff',
    '--color-accent-2':   '#ff0044',
    '--color-accent-3':   '#a020f0',
  },
  matrix: {
    '--color-bg':         '#000800',
    '--color-surface':    '#001200',
    '--color-border':     '#003a00',
    '--color-text':       '#00ff41',
    '--color-text-muted': '#006600',
    '--color-accent':     '#00ff41',
    '--color-accent-2':   '#00cc33',
    '--color-accent-3':   '#007a20',
  },
  amber: {
    '--color-bg':         '#080400',
    '--color-surface':    '#110800',
    '--color-border':     '#2a1500',
    '--color-text':       '#ffb000',
    '--color-text-muted': '#5a3800',
    '--color-accent':     '#ffb000',
    '--color-accent-2':   '#ff6600',
    '--color-accent-3':   '#cc8800',
  },
  neon: {
    '--color-bg':         '#060010',
    '--color-surface':    '#0c0022',
    '--color-border':     '#280055',
    '--color-text':       '#f0c0ff',
    '--color-text-muted': '#5030a0',
    '--color-accent':     '#ff00ff',
    '--color-accent-2':   '#00ffff',
    '--color-accent-3':   '#ff44aa',
  },
  mono: {
    '--color-bg':         '#040404',
    '--color-surface':    '#0a0a0a',
    '--color-border':     '#1e1e1e',
    '--color-text':       '#d0d0d0',
    '--color-text-muted': '#505050',
    '--color-accent':     '#c0c0c0',
    '--color-accent-2':   '#808080',
    '--color-accent-3':   '#a0a0a0',
  },
}

export function applyPalette(name) {
  const palette = PALETTES[name]
  if (!palette) return
  const root = document.documentElement
  Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v))
  localStorage.setItem('palette', name)
}

export function initPalette() {
  const saved = localStorage.getItem('palette') || 'cyberpunk'
  applyPalette(saved)
  return saved
}
