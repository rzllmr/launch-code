const {ipcRenderer} = require('electron');

(function($, window, document) {
  // Listen for the jQuery ready event on the document
  $(function() {
    const Canvas = require('./scripts/canvas');
    const canvas = new Canvas();

    window.addEventListener('resize', () => {
      canvas.scaleToWindow();
    });

    ipcRenderer.on('compile', (event) => {
      $(window).trigger('compile');
    });
  });
}(window.jQuery, window, document));
