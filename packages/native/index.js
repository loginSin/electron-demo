const path = require('node:path');
const addonPath = path.join(__dirname, 'build', 'Release', 'native.node');
module.exports = require(addonPath);


