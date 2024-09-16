export async function onRequestGet({ env }) {
  console.log('GET request received for /api/config');
  try {
    const configStorageId = env.CONFIG_STORAGE.idFromName('global');
    const configStorage = env.CONFIG_STORAGE.get(configStorageId);

    const response = await configStorage.fetch('https://rate-limiter-ui/config');

    if (!response.ok) {
      throw new Error(`Durable Object responded with ${response.status}`);
    }

    return new Response(await response.text(), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in onRequestGet:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ env, request }) {
  console.log('POST request received for /api/config');
  try {
    const configStorageId = env.CONFIG_STORAGE.idFromName('global');
    const configStorage = env.CONFIG_STORAGE.get(configStorageId);

    const config = await request.json();
    const response = await configStorage.fetch('https://rate-limiter-ui/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Durable Object responded with ${response.status}`);
    }

    return new Response('Config saved', { status: 200 });
  } catch (error) {
    console.error('Error in onRequestPost:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
