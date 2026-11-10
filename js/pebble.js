/* Switch real CAD stills, not a simulation or performance animation. */
(function () {
  'use strict';
  var image = document.getElementById('pb-state-image');
  var label = document.getElementById('pb-state-label');
  var buttons = Array.from(document.querySelectorAll('[data-pb-state]'));
  var states = {
    narrow: {src: '../src/img/pebble/prototype.webp', width: '136.5', name: 'Narrow'},
    wide: {src: '../src/img/pebble/wide.webp', width: '161.5', name: 'Wide'}
  };
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var state = states[button.dataset.pbState];
      if (!state || !image || !label) return;
      image.src = state.src;
      image.alt = state.name + ' CAD configuration of PEBBLE, nominal width ' + state.width + ' millimeters';
      label.textContent = state.width + ' mm · nominal';
      buttons.forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
    });
  });
})();
