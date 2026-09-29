(() => {
  const back = document.querySelector('.back-link');
  if (!back) return;
  const destinations = {
    featured: ['../index.html#projects', 'Back to featured projects'],
    all: ['index.html#all', 'Back to all projects'],
    automotive: ['index.html#automotive', 'Back to Automotive projects'],
    university: ['index.html#university', 'Back to University projects'],
    'radio-control': ['index.html#radio-control', 'Back to Radio control projects'],
    miscellaneous: ['index.html#miscellaneous', 'Back to Miscellaneous projects']
  };
  destinations['ford-capri'] = ['ford-capri.html', 'Back to 1989–94 Ford Capri'];
  destinations['honda-cbr250rr'] = ['honda-cbr250rr.html', 'Back to 1990 Honda CBR250RR'];
  destinations['honda-cb250f'] = ['honda-cb250f.html', 'Back to 1994 Honda CB250F'];
  destinations['yamaha-fzr250'] = ['yamaha-fzr250.html', 'Back to 1988 Yamaha FZR250'];
  destinations['ducati-pantah'] = ['ducati-pantah.html', 'Back to 1980 Ducati Pantah 500SL'];
  destinations['latrax-teton'] = ['latrax-teton.html', 'Back to Latrax Teton'];
  destinations['tamiya-honda-city'] = ['tamiya-honda-city.html', 'Back to Tamiya Honda City Turbo'];
  const origin = new URLSearchParams(location.search).get('from');
  const destination = destinations[origin];
  if (destination) {
    back.href = destination[0];
    back.textContent = `← ${destination[1]}`;
  }
})();
