// logger.js
// logging framework
//
// (c) 2016 ChurchTools

var winston = require('winston');

var logger = new (winston.Logger)({
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  transports: [
    new (winston.transports.Console)({ level: 'debug', stderrLevels: ['error', 'fatal'] })
  ]
});

winston.config.addColors({
  fatal: 'blue',
  error: 'red',
  info: 'green',
  warn: 'yellow',
  debug: 'grey'
});

logger.transports.console.colorize = true;

var id = 0;
var log = function (module, level, uuid, message, metadata) {
  json = {
    timestamp: new Date(),
    id: id,
    module: module,
    uuid: uuid,
    level: level,
    message: message,
    metadata: metadata
  };
  logger.log(level, JSON.stringify(json));
  id += 1;
};

module.exports = {
  add: function (transport, options) {
    logger.add(transport, options);
  },

  remove: function (transport) {
    logger.remove(transport);
  },

  getLogger: function (options) {
    return {
      fatal: function (uuid, message, metadata) {
        log(options.module, 'fatal', uuid, message, metadata);
      },
      error: function (uuid, message, metadata) {
        log(options.module, 'error', uuid, message, metadata);
      },
      info: function (uuid, message, metadata) {
        log(options.module, 'info', uuid, message, metadata);
      },
      warn: function (uuid, message, metadata) {
        log(options.module, 'warn', uuid, message, metadata);
      },
      debug: function (uuid, message, metadata) {
        log(options.module, 'debug', uuid, message, metadata);
      }
    };
  }
};

