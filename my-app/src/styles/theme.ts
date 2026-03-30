export const theme = {
  color: {
    bg0: '#070A14',
    bg1: '#0B1021',
    surface: 'rgba(255,255,255,0.06)',
    surface2: 'rgba(255,255,255,0.10)',
    border: 'rgba(255,255,255,0.14)',
    text: 'rgba(255,255,255,0.92)',
    text2: 'rgba(255,255,255,0.70)',
    text3: 'rgba(255,255,255,0.52)',
    accent: '#7C5CFF',
    accent2: '#18D5FF',
    good: '#19C37D',
    warn: '#F7B955',
    bad: '#FF4D6D',
  },
  radius: {
    s: '10px',
    m: '14px',
    l: '18px',
  },
  shadow: {
    soft: '0 16px 40px rgba(0,0,0,0.35)',
  },
  font: {
    ui: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
    mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
} as const

export type Theme = typeof theme

