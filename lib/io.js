const socketIO = require('socket.io-client');

module.exports = (host) => {
  return socketIO(host, {
    reconnection: false
  });
};
