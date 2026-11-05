const root = document.documentElement

document.getElementById('theme-toggle').addEventListener('click', () => {
  root.classList.add('theme-transition')
  const dark = root.classList.toggle('dark')
  try {
    localStorage.theme = dark ? 'dark' : 'light'
  } catch {}
  setTimeout(() => root.classList.remove('theme-transition'), 350)
  dispatchEvent(new Event('themechange'))
})
