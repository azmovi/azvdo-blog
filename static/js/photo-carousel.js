for (const carousel of document.querySelectorAll('[data-carousel]')) {
  const track = carousel.querySelector('.carousel-track')
  const [previous, next] = carousel.querySelectorAll('button')
  const counter = carousel.querySelector('output')
  const slides = [...track.children]
  let current = 0

  const update = () => {
    current = Math.round(track.scrollLeft / track.clientWidth)
    previous.disabled = current === 0
    next.disabled = current === slides.length - 1
    counter.value = `${current + 1} / ${slides.length}`
    slides.forEach((slide, index) => index !== current && slide.querySelector('video')?.pause())
  }
  const go = step => track.scrollTo({ left: (current + step) * track.clientWidth, behavior: 'smooth' })

  previous.addEventListener('click', () => go(-1))
  next.addEventListener('click', () => go(1))
  track.addEventListener('scroll', update, { passive: true })
  update()
}
