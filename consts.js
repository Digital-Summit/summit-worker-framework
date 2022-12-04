const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');

module.exports = {
  EOL: "\n",
  PROJECT_ROOT: projectRoot,
  OBJECTS_PATH: path.join(projectRoot, 'src', 'objects'),
  DIST_PATH: path.join(projectRoot, 'dist'),
  GENERATED_PATH: path.join(projectRoot, '.generated'),
};

const preparePath = require('./tools/preparePath');
preparePath(module.exports.GENERATED_PATH);
preparePath(module.exports.DIST_PATH);
