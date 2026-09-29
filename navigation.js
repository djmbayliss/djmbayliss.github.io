// Keep the hero's name visible as it settles into the navigation's blur zone.
(() => {
  const title = document.getElementById('hero-title');
  const header = document.querySelector('.site-header');
  if (!header) return;

  function setFade() {
    const bottom = header.getBoundingClientRect().bottom;
    document.body.style.setProperty('--fade-start', (bottom + 8) + 'px');
    document.body.style.setProperty('--blur-height', (bottom + 64) + 'px');
  }

  function makeLabel() {
    const label = document.createElement('div');
    label.className = 'floating-section-title';
    label.setAttribute('aria-hidden', 'true');
    document.body.append(label);
    return label;
  }
  function updateLabel(label, heading, region, enabled = true) {
    const navBottom = header.getBoundingClientRect().bottom;
    const visible = enabled && heading && heading.getBoundingClientRect().bottom <= navBottom + 8
      && region.getBoundingClientRect().bottom > navBottom + 120;
    const text = visible ? heading.textContent : '';
    if (label.dataset.current === text) return;
    label.dataset.current = text;
    label.getAnimations().forEach(animation => animation.cancel());
    if (text) label.textContent = text;
    label.style.opacity = text ? '1' : '0';
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      label.animate(text
        ? [{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}]
        : [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],
        {duration:180,easing:'ease-out'});
    }
  }

  // The directory has no hero name to animate, so keep its name in the top band.
  if (!title) {
    const brand = header.querySelector('.brand');
    if (!brand) return;
    const name = document.createElement('a');
    name.className = 'floating-name directory-name';
    name.href = '../index.html';
    name.textContent = brand.textContent;
    name.setAttribute('aria-label', 'Daniel Bayliss — homepage');
    document.body.append(name);
    document.body.classList.add('name-tracking');
    const directoryHeading = document.querySelector('.project-directory .directory-heading h1');
    const directoryLabel = directoryHeading ? makeLabel() : null;
    let pending = false;
    function update() {
      pending = false;
      const compact = innerWidth < 900;
      const rawProgress = Math.min(1, Math.max(0, scrollY / 120));
      const progress = matchMedia('(prefers-reduced-motion: reduce)').matches ? Number(rawProgress >= 1) : rawProgress;
      header.style.setProperty('--nav-scale', 1 - 0.06 * progress);
      header.style.setProperty('--nav-offset', compact ? '28px' : '0px');
      name.style.fontSize = `${compact ? 16 : 26 - 1.435 * progress}px`;
      const nav = header.querySelector('.main-nav a').getBoundingClientRect();
      const content = document.querySelector('main').getBoundingClientRect();
      name.style.left = `${compact ? (innerWidth - name.offsetWidth) / 2 : content.left}px`;
      name.style.top = `${compact ? 21 : nav.top + nav.height / 2 - name.offsetHeight / 2}px`;
      if (directoryLabel) {
        header.style.setProperty('--nav-offset', compact ? '46px' : '0px');
        name.style.fontSize = compact ? '16px' : '22px';
        const navRect = header.querySelector('.main-nav a').getBoundingClientRect();
        const labelBottom = compact ? 54 : navRect.top + navRect.height / 2 + 24.565 * 1.15 / 2;
        directoryLabel.style.fontSize = compact ? '12px' : '14px';
        directoryLabel.style.lineHeight = compact ? '15px' : '18px';
        directoryLabel.style.top = (labelBottom - (compact ? 15 : 18)) + 'px';
        name.style.top = (labelBottom - (compact ? 15 : 18) - 2 - name.offsetHeight) + 'px';
        name.style.left = (compact ? (innerWidth - name.offsetWidth) / 2 : content.left) + 'px';
        updateLabel(directoryLabel, directoryHeading, document.querySelector('main'));
        directoryLabel.style.left = (compact ? (innerWidth - directoryLabel.offsetWidth) / 2 : content.left) + 'px';
      }
      setFade();
    }
    function queue() { if (!pending) { pending = true; requestAnimationFrame(update); } }
    addEventListener('scroll', queue, {passive:true});
    addEventListener('resize', queue);
    addEventListener('pageshow', queue);
    document.fonts.ready.then(queue);
    update();
    return;
  }

  const name = document.createElement('a');
  name.className = 'floating-name';
  name.href = '#top';
  name.textContent = title.textContent;
  name.setAttribute('aria-label', 'Daniel Bayliss — back to top');
  document.body.append(name);
  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'floating-section-title';
  sectionLabel.setAttribute('aria-hidden', 'true');
  document.body.append(sectionLabel);
  const sections = [...document.querySelectorAll('main > section.section')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  function render() {
    frame = 0;
    const rect = title.getBoundingClientRect();
    const font = getComputedStyle(title);
    const compact = innerWidth < 900;
    let dockY = compact ? 21 : 24;
    const startY = rect.top + scrollY;
    const distance = Math.max(1, startY - dockY);
    const progress = Math.min(1, Math.max(0, scrollY / distance));
    const amount = reducedMotion.matches ? Number(progress >= 1) : progress;
    const size = parseFloat(font.fontSize);
    const scale = (compact ? 16 : 22) / size;
    name.style.fontSize = `${size}px`;
    name.style.fontWeight = font.fontWeight;
    name.style.letterSpacing = font.letterSpacing;
    name.style.lineHeight = font.lineHeight;
    header.style.setProperty('--nav-scale', 1 - 0.06 * amount);
    header.style.setProperty('--nav-offset', `${compact ? 46 * amount : 0}px`);
    const navText = header.querySelector('.main-nav a').getBoundingClientRect();
    // Preserve the former name's lower edge for the section label.
    const oldNameHeight = name.offsetHeight * 24.565 / size;
    const labelHeight = compact ? 15 : 18;
    const labelBottom = compact ? 54 : navText.top + navText.height / 2 + oldNameHeight / 2;
    dockY = labelBottom - labelHeight - 2 - name.offsetHeight * scale;
    const labelY = labelBottom - labelHeight;
    sectionLabel.style.fontSize = compact ? '12px' : '14px';
    sectionLabel.style.lineHeight = labelHeight + 'px';
    sectionLabel.style.top = labelY + 'px';
    const active = sections.find(section => {
      const heading = section.querySelector('h2');
      const bottom = header.getBoundingClientRect().bottom;
      return heading && heading.getBoundingClientRect().bottom <= bottom + 8
        && section.getBoundingClientRect().bottom > bottom + 120;
    });
    updateLabel(sectionLabel, active?.querySelector('h2'), active, amount === 1);
    const endX = compact ? (innerWidth - name.offsetWidth * scale) / 2 : rect.left;
    sectionLabel.style.left = `${compact ? (innerWidth - sectionLabel.offsetWidth) / 2 : rect.left}px`;
    // On narrow screens crossfade into the row above the links, so the moving
    // name never passes through or obscures a navigation target.
    const placement = compact ? 1 : amount;
    const opacity = compact ? Math.max(0, (amount - 0.65) / 0.35) : 1;
    name.style.left = `${rect.left + (endX - rect.left) * placement}px`;
    name.style.top = `${rect.top + (dockY - rect.top) * placement}px`;
    name.style.transform = `scale(${1 + (scale - 1) * placement})`;
    name.style.opacity = opacity;
    name.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    title.style.opacity = compact ? Math.max(0, 1 - amount / 0.65) : 0;
    title.querySelector('a').tabIndex = compact && amount < 0.65 ? 0 : -1;
    setFade();
    document.body.classList.add('name-tracking');
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  document.fonts.ready.then(schedule);
  render();
})();
