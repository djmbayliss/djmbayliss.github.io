(() => {
  for (const gallery of document.querySelectorAll('[data-slideshow]')) {
    const slides = [...gallery.querySelectorAll('.project-slide')];
    const controls = gallery.querySelector('.slideshow-controls');
    const previous = gallery.querySelector('[data-previous]');
    const next = gallery.querySelector('[data-next]');
    let current = 0;
    function show(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        if (slide.hidden) slide.querySelectorAll('video').forEach(video => video.pause());
      });
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
    }
    if (!slides.length) continue;
    controls.hidden = false;
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    gallery.addEventListener('keydown', event => {
      if (event.target.closest('video')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    let touchStart;
    gallery.addEventListener('touchstart', event => {
      touchStart = {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY};
    }, {passive: true});
    gallery.addEventListener('touchend', event => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      touchStart = null;
    }, {passive: true});
    show(0);
  }
})();
