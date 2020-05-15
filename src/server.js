'use strict';

const http = require('http');
const url = require('url');

const filesystem = require('./services/filesystem');

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
  })
  .listen(APPLICATION_PORT, APPLICATION_HOST, () =>
    console.log(
      `Server is listening on ${APPLICATION_HOST}:${APPLICATION_PORT}`,
    ),
  );
