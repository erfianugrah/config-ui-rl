export class ConfigStorage {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    console.log('ConfigStorage fetch called with URL:', request.url);
    const url = new URL(request.url);

    try {
      if (url.pathname === '/config') {
        if (request.method === 'GET') {
          console.log('GET request for config');
          return await this.getConfig();
        } else if (request.method === 'POST') {
          console.log('POST request for config');
          return await this.setConfig(request);
        }
      }

      console.log('Not Found for path:', url.pathname);
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in ConfigStorage fetch:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  async getConfig() {
    console.log('Getting config from storage');
    const storedConfig = await this.state.storage.get('config');
    console.log('Stored config:', storedConfig);
    return new Response(JSON.stringify(storedConfig || { rules: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async setConfig(request) {
    console.log('Setting config in storage');
    const config = await request.json();
    console.log('Config to set:', config);
    await this.state.storage.put('config', config);
    return new Response(JSON.stringify({ message: 'Config saved' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
