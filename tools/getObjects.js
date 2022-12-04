const fs = require('fs');
const path = require('path');
const isClass = require(__dirname + '/isClass.js');
const { OBJECTS_PATH } = require(__dirname + '/../consts.js');

module.exports = () => {
  let objects = fs.readdirSync(OBJECTS_PATH);
  objects = objects.filter(objectName => {
    if (objectName.startsWith('.')) {
      return false;
    }

    const objectPaht = path.join(OBJECTS_PATH, objectName);
    if (!fs.lstatSync(objectPaht).isDirectory()) {
      return false;
    }

    const objectIndexPath = path.join(objectPaht, 'index.js');
    if (!fs.existsSync(objectIndexPath)) {
      console.error('\x1b[31mError: \x1b[91m' + objectName + ' object has no index.js.\x1b[0m');
      process.exit(1);
    }

    const importResult = require(objectIndexPath);
    if (!isClass(importResult)) {
      console.error('\x1b[31mError: \x1b[91m' + objectName + ' object is not a class.\x1b[0m');
      process.exit(1);
    }

    if (!(new RegExp('class ' + objectName + '($|\r|\n)')).test(importResult.toString())) {
      console.error('\x1b[31mError: \x1b[91m' + objectName + ' object has no "' + objectName + '" class in module.export of index.js.\x1b[0m');
      process.exit(1);
    }

    return true;
  });

  return objects;
}
