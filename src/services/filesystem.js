'use strict';

const fs = require('fs').promises;
const path = require('path');

const filesystem = {
  getServerData: async () => {
    const serverData = await fs.readFile(
      path.resolve(__dirname, '../tests/mocks/serverData.json'),
    );
    return JSON.parse(serverData);
  },
};

module.exports = filesystem;
