// Align controls with the visual centre of lowercase letters, not the line box.
(() => {
  const context = document.createElement('canvas').getContext('2d');
  function metrics(element, sample = 'x') {
    const style = getComputedStyle(element);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const x = context.measureText(sample);
    const lineHeight = parseFloat(style.lineHeight);
    const ascent = x.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * .8;
    const descent = x.fontBoundingBoxDescent ?? parseFloat(style.fontSize) * .2;
    const baseline = element.getBoundingClientRect().top + (lineHeight-ascent-descent)/2 + ascent;
    return {height:x.actualBoundingBoxAscent+x.actualBoundingBoxDescent, centre:baseline+(x.actualBoundingBoxDescent-x.actualBoundingBoxAscent)/2};
  }
  function align() {
    const heading = document.getElementById('projects-title');
    if (heading) {
      const button = document.querySelector('#projects .section-heading .button');
      button.style.top = '0px';
      const text = metrics(heading, 'P');
      button.style.height = `${metrics(heading, 'rojects').height * 1.1}px`;
      const rect = button.getBoundingClientRect();
      button.style.top = `${text.centre - (rect.top+rect.height/2)}px`;
    }
    for (const row of document.querySelectorAll('.category-title')) {
      if (!row.getClientRects().length) continue;
      const count = row.querySelector('.section-label');
      count.style.top = '0px';
      count.style.top = `${metrics(row.querySelector('h2')).centre-metrics(count).centre}px`;
    }
  }
  document.fonts.ready.then(align);
  addEventListener('resize', align);
  addEventListener('portfolio-layout', align);
  align();
})();
