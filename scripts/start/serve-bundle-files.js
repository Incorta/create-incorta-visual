const { join } = require('path');
const express = require('express');
const chalk = require('chalk');
const socket = require('socket.io');
const cors = require('cors');
const createWatcher = require('../../utils/create-watcher');

const serveBundleFiles = () => {
  console.log(chalk.gray('Starting dev server'));
  const currentProcessDir = process.cwd();
  const distPath = join(currentProcessDir, 'dist');

  const watcher = createWatcher('bundle.js');
  const PORT = 8000;
  const app = express();
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
  const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
  app.use(express.static(distPath));
  const io = socket(server, {
    cors: {
      origin: '*'
    }
  });
  watcher.on('change', path => {
    io.emit('update');
  });
  io.on('connection', function (socket) {});
  io.on('disconnect', () => {
    watcher.close();
  });
};

module.exports = serveBundleFiles;
