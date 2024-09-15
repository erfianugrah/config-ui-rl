import { ConfigStorage } from './config-storage';

export function onRequest(context) {
  return handleRequest(context.request, context.env);
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const configStorageId = env.CONFIG_STORAGE.idFromName('global');
  const configStorage = env.CONFIG_STORAGE.get(configStorageId);

  if (url.pathname === '/api/config') {
    return configStorage.fetch(request);
  }

  return new Response('Not Found', { status: 404 });
}
