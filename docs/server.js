const static = require('node-static');
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const vendorFiles = [
  ['reveal.js/LICENSE'],
  ['reveal.js/dist/reveal.js'],
  ['reveal.js/dist/reveal.css'],
  ['reveal.js/dist/theme/beige.css'],
  ['reveal.js/dist/theme/league.css'],
  ['reveal.js/plugin/highlight/highlight.js'],
  ['reveal_external/LICENSE'],
  ['reveal_external/external/external.js']
];

console.log('updating vendors...');
updateVendors();

const file = new(static.Server)(__dirname);
http.createServer(function(req, res) {
  file.serve(req, res);
}).listen(port);
console.log(`listening on localhost:${port}...`);

function updateVendors() {
  for (const relativePath of vendorFiles) {
    const sourcePath = __dirname + '/../node_modules/' + relativePath;
    const destinationPath = __dirname + '/vendor/' + relativePath;

    const destinationDir = path.dirname(destinationPath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, {recursive: true});
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}
