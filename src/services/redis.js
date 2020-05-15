const Redis = require('ioredis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require('../config');

const port = REDIS_PORT ?? 6379;
const host = REDIS_HOST ?? '127.0.0.1';
const password = REDIS_PASSWORD ?? '';

const redis = new Redis({
  port,
  host,
  password,
});

module.exports = redis;
