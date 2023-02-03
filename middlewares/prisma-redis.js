const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redis = require('redis');
const url = 'redis://127.0.0.1:6379';
const client = redis.createClient(url);

// const { verifyToken } = require('../utils/jwt');

// const cacheData = () => {
//   return async (params, next) => {
//     console.log('this ran');
//     const token = req.signedCookies.token;
//     if (!token) {
//       return;
//     }
//     const payload = verifyToken({ token });
//     const userId = payload.id;
//     const query = {
//       model: params.model,
//       action: params.action,
//       args: params.args,
//     };
//     await client.connect();
//     const cached = await client.HGET(
//       JSON.stringify(userId),
//       JSON.stringify(query)
//     );

//     if (cached) {
//       console.log('cached data', cached);
//       return cached;
//     }

//     console.log('query', query);
//     const result = await next(params);
//     client.HSET(
//       JSON.stringify(userId),
//       JSON.stringify(query),
//       JSON.stringify(data),
//       { EX: 60, NX: true }
//     );
//     console.log('result', result);
//     return result;
//   };
// };
prisma.$use(async function (params, next) {
  const query = JSON.stringify({
    model: params.model,
    action: params.action,
    args: params.args,
  });
  if (!client.isOpen) {
    await client.connect();
  }

  const cache = await client.GET(query);
  if (cache) {
    console.log('cached data', cache);
    const parsedCache = JSON.parse(cache);
    return parsedCache;
  }
  const result = await next(params);
  client.SET(query, JSON.stringify(result), { EX: 60, NX: true });
  console.log('resultfrom database', result);
  return result;
});

// module.exports = { cacheData };

// client.del('1');
// const cached = await client.get(JSON.stringify(userId));
// console.log('after cah', cached);

// if (cached) {
//   console.log('cached data', cached);
//   return res.status(200).json({ cach: true, data: JSON.parse(cached) });
// }
