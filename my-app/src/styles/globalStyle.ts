import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.ui};
    color: ${({ theme }) => theme.color.text};
    background: radial-gradient(1200px 800px at 10% 10%, rgba(124,92,255,0.22), transparent 55%),
                radial-gradient(1000px 700px at 70% 20%, rgba(24,213,255,0.16), transparent 50%),
                linear-gradient(180deg, ${({ theme }) => theme.color.bg0}, ${({ theme }) => theme.color.bg1});
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    opacity: 0.55;
    background:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(1200px 800px at 50% 10%, rgba(0,0,0,1), transparent 65%);
  }
  ::selection {
    background: rgba(124, 92, 255, 0.35);
  }
  a { color: inherit; text-decoration: none; }
  button, input, select { font: inherit; }
  code, pre { font-family: ${({ theme }) => theme.font.mono}; }
  :focus-visible {
    outline: 2px solid rgba(124, 92, 255, 0.75);
    outline-offset: 2px;
  }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.20); }
`

