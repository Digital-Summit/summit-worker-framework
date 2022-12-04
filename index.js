const objects = require('@generated/objects.js');

module.exports = (exp, fetchCallback) => {
  Object.keys(objects).forEach(objectName => {
    exp[objectName] = objects[objectName];
  });

  exp.handlers = {
    async fetch(request, env, context) {
      try {
        return await fetchCallback(request, env, context);
      }
      catch (error) {
        // TODO: remote logger.
        // console.error(error);

        throw error;
      }
    },
  };
};
