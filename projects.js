// data-completed is the completion date, never the upload date (YYYY-MM-DD).
(() => {
  const categories = document.getElementById('categories');
  const collection = document.getElementById('all');
  const heading = document.querySelector('.catalog-title');
  const groups = [...document.querySelectorAll('.catalog-group')];
  const menu = [...document.querySelectorAll('.project-menu a')];
  const flatList = document.querySelector('.all-projects');
  const controls = document.querySelector('.sort-controls');
  const sort = document.getElementById('project-sort');
  const entries = groups.flatMap(group => [...group.querySelectorAll('.project-card')].map(card => ({card, group, parent:card.parentElement})));
  const projects = entries.filter(({card}) => card.dataset.kind !== 'vehicle');
  const dropdowns = new Map();
  let restoredOpen = [];
  try { restoredOpen = JSON.parse(sessionStorage.getItem('portfolio-open-categories') || '[]'); } catch {}
  const saveOpen = () => {
    try { sessionStorage.setItem('portfolio-open-categories', JSON.stringify([...dropdowns].filter(([,details]) => details.open).map(([id]) => id))); } catch {}
  };
  const filters = document.querySelector('.tag-filters');
  categories.before(filters);
  const empty = document.querySelector('.filter-empty');
  const selectedTags = new Set();
  const tagsOf = card => (card.dataset.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
  for (const tag of [...new Set(projects.flatMap(entry => tagsOf(entry.card)))].sort()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-filter';
    button.textContent = tag;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (selectedTags.has(tag)) selectedTags.delete(tag); else selectedTags.add(tag);
      button.setAttribute('aria-pressed', String(selectedTags.has(tag)));
      filterProjects();
    });
    filters.append(button);
  }
  function filterProjects() {
    let visible = 0;
    for (const {card} of projects) {
      card.hidden = ![...selectedTags].every(tag => tagsOf(card).includes(tag));
      if (!card.hidden) visible++;
    }
    empty.hidden = visible > 0;
  }

  function dateOf(card) {
    const value = card.dataset.completed || '';
    if (!/^\d{4}-\d{2}(-\d{2})?$/.test(value)) return null;
    const date = new Date(`${value.length === 7 ? value + "-01" : value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,value.length) === value ? date : null;
  }
  function setOrigin(card, origin) {
    for (const link of card.querySelectorAll('a')) {
      const url = new URL(link.href);
      url.searchParams.set('from', origin);
      link.href = url.href;
    }
  }
  for (const {card} of projects) {
    const date = dateOf(card), label = card.querySelector('.card-topline');
    label.textContent = 'Project';
    if (date) {
      const time = document.createElement('time');
      time.dateTime = card.dataset.completed;
      time.textContent = date.toLocaleDateString('en-AU', {...(card.dataset.completed.length === 10 ? {day:'numeric'} : {}),month:'short',year:'numeric',timeZone:'UTC'});
      label.append(time);
    }
  }
  for (const group of groups) {
    const count = projects.filter(entry => entry.group === group).length;
    document.querySelector(`[data-count="${group.id}"]`).textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
    const oldCard = document.querySelector(`.category-card[href="#${group.id}"]`);
    const details = document.createElement('details');
    details.className = 'category-dropdown';
    details.id = group.id;
    const summary = document.createElement('summary');
    summary.className = 'category-card';
    summary.append(...oldCard.childNodes);
    summary.querySelector('.project-cta').textContent = 'Expand';
    details.append(summary, group.querySelector('.featured-projects'));
    oldCard.replaceWith(details);
    group.remove();
    dropdowns.set(details.id, details);
    details.open = restoredOpen.includes(details.id);
    let animation = null;
    let targetOpen = false;
    summary.addEventListener('click', event => {
      event.preventDefault();
      targetOpen = animation ? !targetOpen : !details.open;
      if (targetOpen) history.replaceState(null, '', '#' + details.id);
      else if (location.hash === '#' + details.id) history.replaceState(null, '', '#categories');
      const startHeight = details.getBoundingClientRect().height;
      if (animation) animation.cancel();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = null;
        details.open = targetOpen;
        return;
      }
      details.open = true;
      const endHeight = targetOpen ? details.scrollHeight + 2 : summary.offsetHeight + 2;
      animation = details.animate({height:[`${startHeight}px`, `${endHeight}px`]}, {duration:180, easing:'ease-out'});
      animation.onfinish = () => { details.open = targetOpen; animation = null; };
    });
    details.addEventListener('toggle', () => {
      saveOpen();
      summary.querySelector('.project-cta').textContent = details.open ? 'Collapse' : 'Expand';

    });
  }
  function sortProjects() {
    const ordered = [...projects].sort((a,b) => {
      const first = dateOf(a.card), second = dateOf(b.card);
      if (!first && !second) return 0;
      if (!first) return 1;
      if (!second) return -1;
      return sort.querySelector('input:checked').value === 'oldest' ? first - second : second - first;
    });
    flatList.append(...ordered.map(entry => entry.card));
    filterProjects();
  }
  function showView(moveFocus = false) {
    const showAll = location.hash === '#all';
    filters.classList.toggle('is-placeholder', !showAll);
    filters.inert = !showAll;
    filters.setAttribute('aria-hidden', String(!showAll));
    categories.hidden = showAll;
    collection.hidden = !showAll;
    flatList.hidden = !showAll;
    controls.hidden = !showAll;
    heading.hidden = !showAll;
    document.querySelector('.directory-toolbar').classList.toggle('show-all', showAll);
    if (showAll) {
      for (const entry of entries) setOrigin(entry.card, 'all');
      sortProjects();
    } else {
      for (const entry of entries) {
        entry.card.hidden = Boolean(entry.card.dataset.vehicle);
        entry.parent.append(entry.card);
        setOrigin(entry.card, entry.group.id);
      }
      const selected = dropdowns.get(location.hash.slice(1));
      if (selected) {
        selected.open = true;
        requestAnimationFrame(() => selected.scrollIntoView({block: 'start', behavior: 'instant'}));
      }
    }
    for (const link of menu) {
      if (link.hash === (showAll ? '#all' : '#categories')) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    if (moveFocus && showAll) heading.focus({preventScroll:true});
    dispatchEvent(new Event('portfolio-layout'));
  }
  sort.addEventListener('change', () => {
    sortProjects();
    sort.querySelector('.sort-selection').textContent = sort.querySelector('input:checked').value === 'oldest' ? 'Oldest first' : 'Newest first';
    sort.open = false;
    sort.querySelector('summary').focus();
  });
  document.addEventListener('click', event => { if (!sort.contains(event.target)) sort.open = false; });
  sort.addEventListener('keydown', event => {
    if (event.key === 'Escape') { sort.open = false; sort.querySelector('summary').focus(); }
  });
  showView();
  addEventListener('hashchange', () => showView(true));
})();
