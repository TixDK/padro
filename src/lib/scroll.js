// Smooth-scrolls to a section without writing the hash to the URL.
// Use as: onClick={(e) => scrollToId('players', e)}  or  onClick={scrollToTop}
export function scrollToId(id, event) {
  if (event) event.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function scrollToTop(event) {
  if (event) event.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Generic guard for "dead" placeholder anchors (href="#") so they don't
// dirty the URL with a stray hash.
export function preventNav(event) {
  event.preventDefault()
}
