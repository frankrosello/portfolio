'use strict';
const carouselInstances = new Map();

function initCarousels(scope = document) {
  scope.querySelectorAll('[data-carousel]').forEach(root => {
    if (carouselInstances.has(root)) return;
    const slides = [...root.querySelectorAll('.carousel-slide')];
    const dots = [...root.querySelectorAll('[data-slide]')];
    const play = root.querySelector('[data-carousel-play]');
    const caption = root.querySelector('[data-carousel-caption]');
    const count = root.querySelector('[data-carousel-count]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let paused = root.dataset.autoplay !== 'true' || motion.matches;
    let hovered = false;
    let visible = true;
    let timer;
    let touchStart;
    let suppressClick = false;

    function clearTimer() { window.clearTimeout(timer); timer = undefined; }
    function schedule() {
      clearTimer();
      if (!paused && !hovered && visible && !document.hidden) {
        timer = window.setTimeout(() => { show(index + 1); }, 6000);
      }
    }
    function syncPlay() {
      play.textContent = paused ? 'Play' : 'Pause';
      play.setAttribute('aria-label', paused ? 'Start screenshot rotation' : 'Pause screenshot rotation');
      caption.setAttribute('aria-live', paused ? 'polite' : 'off');
    }
    function show(next, manual = false) {
      index = ((next % slides.length) + slides.length) % slides.length;
      if (manual) paused = true;
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
      caption.textContent = slides[index].dataset.caption;
      count.textContent = `${index + 1} / ${slides.length}`;
      syncPlay();
      schedule();
    }
    const controller = new AbortController();
    const options = { signal: controller.signal };
    root.querySelector('[data-carousel-prev]').addEventListener('click', () => show(index - 1, true), options);
    root.querySelector('[data-carousel-next]').addEventListener('click', () => show(index + 1, true), options);
    dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.slide), true), options));
    play.addEventListener('click', () => { paused = !paused; syncPlay(); schedule(); }, options);
    root.addEventListener('mouseenter', () => { hovered = true; clearTimer(); }, options);
    root.addEventListener('mouseleave', () => { hovered = false; schedule(); }, options);
    root.addEventListener('focusin', event => { if (event.target !== play) { paused = true; syncPlay(); clearTimer(); } }, options);
    root.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
      }
    }, options);
    const viewport = root.querySelector('.carousel-viewport');
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
    }, options);
    viewport.addEventListener('pointerup', event => {
      if (!touchStart) return;
      const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
      touchStart = undefined;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        suppressClick = true;
        show(index + (dx < 0 ? 1 : -1), true);
        window.setTimeout(() => { suppressClick = false; }, 250);
      }
    }, options);
    viewport.addEventListener('pointercancel', () => { touchStart = undefined; }, options);
    viewport.addEventListener('click', event => {
      if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; }
    }, { ...options, capture: true });
    const visibilityChange = () => schedule();
    document.addEventListener('visibilitychange', visibilityChange, options);
    const motionChange = () => { if (motion.matches) paused = true; syncPlay(); schedule(); };
    motion.addEventListener('change', motionChange, options);
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        schedule();
      });
      observer.observe(root);
    }
    carouselInstances.set(root, {
      destroy() { clearTimer(); controller.abort(); observer?.disconnect(); carouselInstances.delete(root); }
    });
    show(0);
  });
}

document.querySelector('#project-dialog').addEventListener('close', () => {
  document.querySelector('#project-dialog').querySelectorAll('[data-carousel]').forEach(root => carouselInstances.get(root)?.destroy());
});
initCarousels();
