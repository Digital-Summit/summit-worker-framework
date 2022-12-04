const fs = require('fs');
const path = require('path');
const getObjects = require(__dirname + '/../tools/getObjects.js');
const { EOL, DIST_PATH } = require(__dirname + '/../consts.js');

function buildShimContent(objects) {
  let content = '// Do NOT modify this file! Its content is automatically updated.' + EOL + EOL;
  content += 'import bundle from \'./main.js\';' + EOL;
  content += 'const handlers = bundle.handlers;' + EOL;

  objects.forEach(objectName => {
    content += 'const ' + objectName + ' = bundle.' + objectName + ';' + EOL;
  });

  let exportsInContent = [ 'handlers as default', ...objects ];
  content += 'export { ' + exportsInContent.join(', ') + ' };' + EOL;

  return content;
}

const objects = getObjects();

const shimPath = path.join(DIST_PATH, 'shim.mjs');
const shimContent = buildShimContent(objects);

fs.writeFileSync(shimPath, shimContent);
