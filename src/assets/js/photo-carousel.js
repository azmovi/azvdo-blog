document.querySelectorAll('[data-photo-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]')
  if (!track) return

  const slides = Array.from(track.children)
  const previous = carousel.querySelector('[data-carousel-previous]')
  const next = carousel.querySelector('[data-carousel-next]')
  const status = carousel.querySelector('[data-carousel-status]')

  if (!previous || !next || !status || slides.length < 2) return

  let activeIndex = 0
  let scrollFrame = null

  const updateControls = () => {
    previous.disabled = activeIndex === 0
    next.disabled = activeIndex === slides.length - 1
    status.textContent = `${activeIndex + 1} / ${slides.length}`
  }

  const goTo = (index) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1))
    track.scrollTo({ left: activeIndex * track.clientWidth, behavior: 'smooth' })
    updateControls()
  }

  previous.addEventListener('click', () => goTo(activeIndex - 1))
  next.addEventListener('click', () => goTo(activeIndex + 1))

  track.addEventListener('scroll', () => {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame)
    scrollFrame = requestAnimationFrame(() => {
      const slideWidth = track.clientWidth
      if (slideWidth > 0) {
        activeIndex = Math.round(track.scrollLeft / slideWidth)
        slides.forEach((slide, index) => {
          if (index !== activeIndex) slide.querySelector('video')?.pause()
        })
        updateControls()
      }
      scrollFrame = null
    })
  }, { passive: true })

  updateControls()
})
