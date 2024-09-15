export async function onRequestGet({ env }) {
  try {
    const id = env.CONFIG_STORAGE.idFromName('global');
    const obj = env.CONFIG_STORAGE.get(id);
    const response = await obj.fetch('https://rate-limiter-ui/config');

    if (!response.ok) {
      throw new Error(`Durable Object responded with ${response.status}`);
    }

    const config = await response.json();
    return new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const config = await request.json();
    const id = env.CONFIG_STORAGE.idFromName('global');
    const obj = env.CONFIG_STORAGE.get(id);
    const response = await obj.fetch('https://rate-limiter-ui/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Durable Object responded with ${response.status}`);
    }

    return new Response(JSON.stringify({ message: 'Config saved' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
