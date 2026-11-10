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

/* Assembly stills expose the actual CAD, without implying physical validation. */
(function(){'use strict';var image=document.getElementById('pb-assembly-image'),caption=document.getElementById('pb-assembly-caption');var buttons=Array.from(document.querySelectorAll('[data-pb-assembly]'));var panels=Array.from(document.querySelectorAll('[data-pb-assembly-panel]'));var views={inside:{caption:'Wheel shells, case and tail removed. Both wheel-spacing mechanisms are shown extended.',alt:'PEBBLE internal CAD with the wheel shells, core housing and tail removed to reveal the wheel units, width linkages and electronics sled'},wheel:{caption:'Right wheel sectioned along the CAD X=0 plane. Selected left-side and core assemblies hidden.',alt:'CAD section through the right PEBBLE wheel showing the motor sleeve, bearing stack and shell hub'},width:{caption:'Independent width linkages, glands and wheel-unit sleeves. Wheel shells, core and sled hidden.',alt:'CAD of two KST servo crank-slider linkages, steel width rods, glands and motor sleeves'},sled:{caption:'F5v12 sled and selected electronic modules with the outer case removed. Reference envelopes are simplified.',alt:'CAD of the PEBBLE F5v12 electronics sled with controller boards, regulators and battery reference envelope'}};buttons.forEach(function(button){button.addEventListener('click',function(){var key=button.dataset.pbAssembly,view=views[key];if(!view||!image||!caption)return;image.src='../src/img/pebble/'+key+'.webp';image.alt=view.alt;caption.textContent=view.caption;buttons.forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});panels.forEach(function(p){p.hidden=p.dataset.pbAssemblyPanel!==key;});});});})();
