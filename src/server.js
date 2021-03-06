'use strict';

const http = require('http');
const url = require('url');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

const filesystem = require('./services/filesystem');
const redis = require('./services/redis');
const memcached = require('./services/memcached');

const { APPLICATION_HOST, APPLICATION_PORT } = require('./config');

http
  .createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });

    if (parsedUrl.pathname === '/') {
      try {
        const serverData = await filesystem.getServerData();
        const strServerData = JSON.stringify(serverData);
        res.end(strServerData);
      } catch (error) {
        console.info('Filesystem module error: \n');
        console.error(error);
      }
    }

    if (parsedUrl.pathname === '/redis') {
      try {
        const redisCache = await redis.get('server_data');

        console.log(redisCache ? 'Cached' : 'UnCached');

        if (!redisCache) {
          await sleep(2000);
          const serverData = await filesystem.getServerData();
          const strServerData = JSON.stringify(serverData);
          redis.setex('server_data', 20, strServerData);
          res.end(strServerData);
          return;
        }
        res.end(redisCache);
      } catch (error) {
        console.info('Redis module error: \n');
        console.error(error);
      }
    }

    if (parsedUrl.pathname === '/memcached') {
      memcached.get('server_data', (error, memcachedCache) => {
        if (error) {
          console.info('Memcached module error: \n');
          console.error(error);
          return;
        }
        console.log(memcachedCache ? 'Cached' : 'UnCached');
        if (!memcachedCache) {
          filesystem
            .getServerData()
            .then((serverData) => {
              const strServerData = JSON.stringify(serverData);
              memcached.set('server_data', strServerData, 20, (error) => {
                if (error) {
                  console.info('Memcached module error: \n');
                  console.error(error);
                  return;
                }
                res.end(strServerData);
                return;
              });
            })
            .catch((error) => console.error(error));
        }
        res.end(memcachedCache);
      });
    }
  })
  .listen(APPLICATION_PORT, APPLICATION_HOST, () =>
    console.log(
      `Server is listening on ${APPLICATION_HOST}:${APPLICATION_PORT}`,
    ),
  );
