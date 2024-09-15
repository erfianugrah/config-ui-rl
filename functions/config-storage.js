export class ConfigStorage {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config') {
      if (request.method === 'GET') {
        return await this.getConfig();
      } else if (request.method === 'POST') {
        return await this.setConfig(request);
      }
    }

    return new Response('Not Found', { status: 404 });
  }

  async getConfig() {
    const storedConfig = await this.state.storage.get('config');
    return new Response(JSON.stringify(storedConfig || { rules: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async setConfig(request) {
    const config = await request.json();
    await this.state.storage.put('config', config);
    return new Response('Config saved', { status: 200 });
  }
}
