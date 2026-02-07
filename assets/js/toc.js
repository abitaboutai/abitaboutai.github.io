(() => {
  function isPost() {
    return document.body.classList.contains('layout--single') && document.querySelector('.page__content');
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function buildToc() {
    if (!isPost()) return;

    const content = document.querySelector('.page__content');
    const headings = Array.from(content.querySelectorAll('h2, h3'))
      .filter(h => h.textContent && !/permalink/i.test(h.textContent));

    if (headings.length < 2) return;

    // Ensure ids
    for (const h of headings) {
      if (!h.id) h.id = slugify(h.textContent);
    }

    const nav = document.createElement('nav');
    nav.className = 'toc-auto';

    const details = document.createElement('details');
    details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = 'On this page';
    details.appendChild(summary);

    const ul = document.createElement('ul');
    ul.className = 'toc-auto__menu';

    for (const h of headings) {
      const li = document.createElement('li');
      li.className = h.tagName.toLowerCase() === 'h3' ? 'toc-auto__h3' : 'toc-auto__h2';
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.replace('Permalink', '').trim();
      li.appendChild(a);
      ul.appendChild(li);
    }

    details.appendChild(ul);
    nav.appendChild(details);

    const rail = document.querySelector('.sidebar__right');
    if (!rail) return;

    // Replace existing empty TOC if present
    rail.innerHTML = '';
    rail.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToc);
  } else {
    buildToc();
  }
})();
