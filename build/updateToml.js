const fs = require('fs');
const path = require('path');
const toml = require('toml');
const getObjects = require(__dirname + '/../tools/getObjects.js');
const { EOL, PROJECT_ROOT } = require('../consts.js');

const DOT = '.';
const DOT_PLACEHOLDER = '_DOT_';

const tomlPath = path.join(PROJECT_ROOT, 'wrangler.toml');
const tomlContent = fs.readFileSync(tomlPath).toString();
const parsedToml = toml.parse(tomlContent.replaceAll(DOT, DOT_PLACEHOLDER));

const objects = getObjects();

let classListByMigrations = [];
parsedToml.migrations.forEach(version => {
  if (version.new_classes) {
    version.new_classes.forEach(className => classListByMigrations.push(className));
  }

  if (version.deleted_classes) {
    version.deleted_classes.forEach(className => classListByMigrations = classListByMigrations.filter(i => i !== className));
  }

  if (version.renamed_classes) {
    version.renamed_classes.forEach(item => {
      classListByMigrations = classListByMigrations.filter(i => i !== item.from);
      classListByMigrations.push(item.to);
    });
  }
});
classListByMigrations = [ ...new Set(classListByMigrations) ];

const newClasses = objects.filter(i => classListByMigrations.indexOf(i) === -1);
const deletedClasses = classListByMigrations.filter(i => objects.indexOf(i) === -1);

if (newClasses.length !== 0 || deletedClasses.length !== 0) {
  const lastMigrationVersion = parseInt(parsedToml.migrations[parsedToml.migrations.length - 1].tag.substring(1));
  const nextVersion = lastMigrationVersion + 1;

  const migration = { tag: 'v' + nextVersion };

  if (newClasses.length !== 0) {
    migration['new_classes'] = newClasses;
  }
  if (deletedClasses.length !== 0) {
    migration['deleted_classes'] = deletedClasses;
  }

  parsedToml.migrations.push(migration);
}

function compileToml(parsedToml, separator) {
  if (!separator) {
    separator = EOL;
  }

  let contentParts = [];

  if (typeof parsedToml === 'string') {
    return '"' + parsedToml + '"' + separator;
  }

  Object.keys(parsedToml).forEach(key => {
    const value = parsedToml[key];

    const isDurableObjectArray = key === 'durable_objects_DOT_bindings';
    const isMigrations = key === 'migrations';

    if (isDurableObjectArray) {
      contentParts.push('durable_objects_DOT_bindings = [');
      objects.forEach(className => {
        contentParts.push('  { name = "' + className + '", class_name = "' + className + '" },');
      })
      contentParts.push(']');
      return;
    }

    if (isMigrations) {
      contentParts.push('[[migrations]]');
      value.forEach(item => {
        contentParts.push(compileToml(item) + EOL);
      });
      return;
    }

    const valueType = Array.isArray(value) ? 'array' : typeof value;
    switch (valueType) {
      case 'string':
        contentParts.push(key + ' = "' + value + '"');
        break;

      case 'boolean':
        contentParts.push(key + ' = ' + (value ? 'true' : 'false'));
        break;

      case 'object':
        contentParts.push(separator + '[' + key + ']' + separator + compileToml(value));
        break;

      case 'array':
        let content = key + ' = [' + separator;
        value.forEach(item => {
          content += '  ' + compileToml(item, ',') + separator;
        });
        content += ']';

        contentParts.push(content);
        break;
    }
  });

  let result = contentParts.join(separator);

  return result;
}

const newToml = compileToml(parsedToml).replaceAll(DOT_PLACEHOLDER, DOT);

// fs.writeFileSync(tomlPath + '.bak', tomlContent);
fs.writeFileSync(tomlPath, newToml);
