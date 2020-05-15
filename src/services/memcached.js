const Memcached = require('memcached');

const { MEMCACHED_HOST, MEMCACHED_PORT } = require('../config');

const host = MEMCACHED_HOST ?? '127.0.0.1';
const port = MEMCACHED_PORT ?? 11211;

const memcached = new Memcached(`${host}:${port}`);

module.exports = memcached;
