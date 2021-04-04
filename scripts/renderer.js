const {ipcRenderer} = require('electron');

(function($, window, document) {
  // Listen for the jQuery ready event on the document
  $(function() {
    const Canvas = require('./scripts/canvas');
    const canvas = new Canvas();

    window.addEventListener('resize', () => {
      canvas.scaleToWindow();
    });

    ipcRenderer.on('test', (event) => {
      $(window).trigger('test', 'rocket');
    });
  });
}(window.jQuery, window, document));
