// Shared name/title dock, responsive navigation and project-page scroll control.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const heroTitle = document.getElementById('hero-title');
  const home = Boolean(heroTitle);
  const detailPage = !home && !document.querySelector('.project-directory');
  const main = document.querySelector('main');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const name = document.createElement('a');
  name.className = 'floating-name directory-name';
  name.href = home ? '#top' : '../index.html#top';
  name.textContent = 'Daniel Bayliss';
  name.setAttribute('aria-label', home ? 'Daniel Bayliss — back to top' : 'Daniel Bayliss — homepage');
  const label = document.createElement('div');
  label.className = 'floating-section-title';
  label.setAttribute('aria-hidden', 'true');
  document.body.append(name, label);
  document.body.classList.add('name-tracking');
  let topButton;
  if (!home && document.body.classList.contains('projects-page')) {
    topButton = document.createElement('a');
    topButton.className = 'scroll-to-top';
    topButton.href = '#top';
    topButton.textContent = '↑';
    topButton.setAttribute('aria-label', 'Back to top');
    topButton.hidden = true;
    document.body.append(topButton);
  }
  function setLabel(text) {
    if (label.dataset.current === text) return;
    label.dataset.current = text;
    label.getAnimations().forEach(a => a.cancel());
    if (text) label.textContent = text;
    label.style.opacity = text ? '1' : '0';
    if (!reduced.matches) label.animate(text
      ? [{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}]
      : [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],
      {duration:180,easing:'ease-out'});
  }
  let frame;
  function render() {
    frame = null;
    const narrow = innerWidth < 600;
    const compact = innerWidth < 1050;
    const sidePadding = narrow ? 20 : 32;
    const edge = compact ? sidePadding : Math.max(sidePadding, main.getBoundingClientRect().left);
    const nameWidth = narrow ? 102 : compact ? 145 : 180;
    const gap = narrow ? 10 : 20;
    const navLeftLimit = edge + nameWidth + gap;
    const available = Math.max(140, innerWidth - navLeftLimit - sidePadding);
    const menu = header.querySelector('.main-nav');
    header.style.setProperty('--nav-offset', '0px');
    header.style.width = 'max-content';
    header.style.maxWidth = 'none';
    menu.style.gridTemplateColumns = 'repeat(6, max-content)';
    const naturalWidth = header.offsetWidth;
    const columns = available >= 220 ? 3 : 2;
    if (naturalWidth > available) {
      header.style.width = available + 'px';
      menu.style.gridTemplateColumns = 'repeat(' + columns + ', minmax(0, 1fr))';
    }
    const centered = (innerWidth - header.offsetWidth) / 2;
    const canCenter = centered >= navLeftLimit;
    const navLeft = canCenter ? centered : innerWidth - sidePadding - header.offsetWidth;
    header.style.marginLeft = navLeft + 'px';
    header.style.marginRight = sidePadding + 'px';
    const nameSize = narrow ? 14 : compact ? 18 : 22;
    name.style.fontSize = nameSize + 'px';
    const dockedNameWidth = name.offsetWidth;
    const left = canCenter ? Math.max(edge, navLeft - dockedNameWidth - 80) : edge;
    const raw = Math.min(1, Math.max(0, scrollY / 120));
    const scrollingProgress = reduced.matches ? Number(raw >= 1) : raw;
    const progress = detailPage ? 1 : scrollingProgress;
    header.style.setProperty('--nav-scale', 1 - .06 * progress);
    header.style.transformOrigin = canCenter ? 'top center' : 'top right';
    const nav = header.getBoundingClientRect();
    // Transforms do not shrink the header's layout box; compensate on detail pages.
    document.body.style.setProperty('--content-top-gap', (19.2 - (detailPage ? header.offsetHeight * .06 : 0)) + 'px');
    const labelSize = narrow ? 11 : compact ? 12 : 14;
    const dockTop = nav.top + Math.max(4, (nav.height - nameSize * 1.15 - labelSize * 2.3 - 3) / 2);
    name.style.fontSize = nameSize + 'px';
    name.style.lineHeight = '1.15';
    name.style.left = left + 'px';
    name.style.top = dockTop + 'px';
    name.style.transform = 'none';
    name.style.opacity = '1';
    name.style.visibility = 'visible';
    label.style.left = left + 'px';
    label.style.top = (dockTop + nameSize * 1.15 + 3) + 'px';
    label.style.fontSize = labelSize + 'px';
    label.style.lineHeight = '1.15';
    label.style.width = Math.max(80, nav.left - left - gap) + 'px';
    let docked = true;
    if (home) {
      const rect = heroTitle.getBoundingClientRect();
      const font = getComputedStyle(heroTitle);
      const amount = Math.min(1, Math.max(0, scrollY / Math.max(1, rect.top + scrollY - dockTop)));
      docked = amount === 1;
      if (!compact) {
        const size = parseFloat(font.fontSize);
        name.style.fontSize = size + 'px';
        name.style.fontWeight = font.fontWeight;
        name.style.letterSpacing = font.letterSpacing;
        name.style.left = (rect.left + (left - rect.left) * amount) + 'px';
        name.style.top = (rect.top + (dockTop - rect.top) * amount) + 'px';
        name.style.transform = `scale(${1 + (nameSize / size - 1) * amount})`;
        heroTitle.style.opacity = '0';
      } else {
        name.style.opacity = String(Math.max(0, (amount - .65) / .35));
        name.style.visibility = amount > .65 ? 'visible' : 'hidden';
        heroTitle.style.opacity = String(Math.max(0, 1 - amount / .65));
      }
      heroTitle.querySelector('a').tabIndex = compact && !docked ? 0 : -1;
    }
    let text = '';
    const candidates = home
      ? [...document.querySelectorAll('.hero, main > section.section')].map(region => ({region, heading:region.querySelector('.hero-role, h2'), clearance:region.classList.contains('hero') ? 16 : 120}))
      : [{region:main,heading:main.querySelector('h1'),clearance:80}];
    for (const {region,heading,clearance} of candidates) {
      if (docked && heading && heading.getBoundingClientRect().bottom <= nav.bottom + 8 && region.getBoundingClientRect().bottom > nav.bottom + clearance) text = heading.textContent;
    }
    setLabel(text);
    // End the fade at the first content edge, leaving the initial bubble clear.
    document.body.style.setProperty('--fade-start', (nav.bottom + 4) + 'px');
    document.body.style.setProperty('--blur-height', (nav.bottom + nav.top) + 'px');
    document.documentElement.style.scrollPaddingTop = (nav.bottom + 64) + 'px';
    if (topButton) topButton.hidden = scrollY < 240;
  }
  function queue() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue);
  addEventListener('pageshow', queue);
  reduced.addEventListener('change', queue);
  document.fonts.ready.then(queue);
  render();
})();
