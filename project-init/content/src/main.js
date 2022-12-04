const init = require('summit-worker-framework');

// The second argument is the "fetch" event handler function.
// https://developers.cloudflare.com/workers/get-started/guide/#5-write-code
init(exports, async (request, env, context) => {
  const objectId = env.Example.idFromName('main');
  const examplerObject = env.Example.get(objectId);

  return await examplerObject.fetch(request);
});
