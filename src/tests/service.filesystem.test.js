'use strict';

// Tests
const { deepEqual } = require('.');

// Mock data
const serverData = require('./mocks/serverData');

const filesystem = require('../services/filesystem');

(async () => {
  deepEqual(
    'Should output the serverData from the filesystem (fs.readfile)',
    await filesystem.getServerData(serverData),
    serverData,
  );
})();
