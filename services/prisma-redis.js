const redis = require('redis');
const url = 'redis://127.0.0.1:6379';
const client = redis.createClient(url);

async function cacheData(params, next) {
  const model = JSON.stringify(params.model);
  if (
    params.action === 'create' ||
    params.action === 'update' ||
    params.action === 'delete'
  ) {
    client.DEL(model);
  }
  const query = JSON.stringify({
    action: params.action,
    args: params.args,
  });
  console.log('query: ', query);

  if (!client.isOpen) {
    await client.connect();
  }

  const cache = await client.HGET(model, query);
  if (cache) {
    console.log('cached data', cache);
    const parsedCache = JSON.parse(cache);
    return parsedCache;
  }
  const result = await next(params);
  client.HSET(model, query, JSON.stringify(result), { EX: 120, NX: true });
  console.log('resultfrom database', result);
  return result;
}

module.exports = { cacheData };
