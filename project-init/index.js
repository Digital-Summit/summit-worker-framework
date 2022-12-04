const fs = require("fs")
const path = require("path")
const { PROJECT_ROOT } = require(__dirname + '/../consts.js');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  }
  else {
    fs.copyFileSync(src, dest);
  }
}

const copyFrom = path.join(__dirname, 'content');
const copyTo = PROJECT_ROOT;
copyRecursiveSync(copyFrom, copyTo);

const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
const packageJsonContent = require(packageJsonPath);
packageJsonContent['scripts']['dev'] = 'webpack';
packageJsonContent['scripts']['build'] = 'miniflare --watch --debug';
packageJsonContent['scripts']['deploy'] = 'wrangler publish';
packageJsonContent['main'] = './dist/main.js';

const packageJsonString = JSON.stringify(packageJsonContent, null, 2);
fs.writeFileSync(packageJsonPath, packageJsonString);
