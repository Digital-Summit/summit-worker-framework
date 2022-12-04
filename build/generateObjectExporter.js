const fs = require('fs');
const path = require('path');
const getObjects = require(__dirname + '/../tools/getObjects.js');
const { EOL, GENERATED_PATH } = require(__dirname + '/../consts.js');

function buildObjectExporterContent(objects) {
  let content = '// Do NOT modify this file! Its content is automatically updated.' + EOL + EOL;
  content += 'module.exports = {' + EOL;
  objects.forEach(objectName => {
    content += '  \'' + objectName + '\': require(\'@/objects/' + objectName + '\'),' + EOL;
  });
  content += '}' + EOL;

  return content;
}

const objects = getObjects();

const objectExporterPath = path.join(GENERATED_PATH, 'objects.js');
const objectExporterContent = buildObjectExporterContent(objects);

fs.writeFileSync(objectExporterPath, objectExporterContent);
