(() => {
  function ensureBar() {
    let bar = document.querySelector('.reading-progress');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.innerHTML = '<div class="reading-progress__bar"></div>';
    document.body.appendChild(bar);
    return bar;
  }

  function isPost() {
    return document.body.classList.contains('layout--single') && document.querySelector('.page__content');
  }

  function update() {
    if (!isPost()) return;
    const el = document.querySelector('.page__content');
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // Compute progress through the article (top of content to bottom of content)
    const contentTop = window.scrollY + rect.top;
    const contentHeight = el.scrollHeight;
    const viewport = window.innerHeight;

    const start = contentTop - 12; // small offset
    const end = contentTop + contentHeight - viewport + 24;
    const y = window.scrollY;

    let p;
    if (y <= start) p = 0;
    else if (y >= end) p = 1;
    else p = (y - start) / (end - start);

    const barFill = document.querySelector('.reading-progress__bar');
    if (barFill) barFill.style.transform = `scaleX(${p})`;
  }

  function onReady() {
    if (!isPost()) return;
    ensureBar();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
