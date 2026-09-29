// Native disclosure supports click/keyboard; mouse users can also hover.
document.querySelectorAll('.nav-projects').forEach(menu => {
  const trigger = menu.querySelector('summary');
  let pinned = false;
  const close = () => { pinned = false; menu.open = false; };
  menu.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') menu.open = true;
  });
  menu.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !pinned && !menu.contains(document.activeElement)) menu.open = false;
  });
  trigger.addEventListener('click', event => {
    event.preventDefault();
    pinned = !pinned;
    menu.open = pinned;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); trigger.focus(); }
    if (event.key === 'ArrowDown' && event.target === trigger) {
      event.preventDefault();
      menu.open = true;
      menu.querySelector('a').focus();
    }
  });
  menu.addEventListener('focusout', event => { if (!menu.contains(event.relatedTarget)) close(); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', event => { if (!menu.contains(event.target)) close(); });
});
