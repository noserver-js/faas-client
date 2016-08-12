const io = require('./io');
const { uniqueId } = require('lodash');

const validate = (socket, appId, resolve) => {
  socket.emit('validation', {
    appId
  });

  socket.once('validation complete', ({methods}) => {
    resolve(methods);
  });
};

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {

    const socket = io(options.host);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    // -----

    validate(socket, options.appId, (methods) => {
      const faas = {};
      for (const method of methods) {

        faas[method] = (...props) => new Promise((resolve, reject) => {
          const uid = uniqueId();

          socket.emit(method, {
            props,
            uid,
          });

          socket.once(`${method} done ${uid}`, args => {
            resolve(args);
          });
        });
      }

      resolve({
        faas
      });
    });
  });
};
