const giscus = document.querySelector('.giscus')
const giscusTheme = () =>
  document.documentElement.classList.contains('dark') ? 'catppuccin_mocha' : 'catppuccin_latte'

const script = document.createElement('script')
Object.assign(script.dataset, giscus.dataset, {
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '0',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'pt',
  loading: 'lazy',
  theme: giscusTheme(),
})
script.src = 'https://giscus.app/client.js'
script.crossOrigin = 'anonymous'
script.async = true
giscus.after(script)

addEventListener('themechange', () => {
  document
    .querySelector('iframe.giscus-frame')
    ?.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app')
})
