// Example durable object.
// https://developers.cloudflare.com/workers/learning/using-durable-objects/
module.exports = class Example
{
  constructor(state, env) {
    this.env = env;
    this.storage = state.storage;
  }

  async fetch(request) {
    return new Response('Hello World!');
  }
}
