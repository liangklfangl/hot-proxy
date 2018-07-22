'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _App = require('../App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (proxyPort, uiPort) {
    const app = new _App2.default();
    yield app.init();
    app.start(proxyPort, uiPort);
    process.on('unhandledRejection', function (reason, p) {
      if (process.env.DEBUG) {
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
      }
    });
    process.on('SIGINT', function () {
      process.exit();
    });
    process.on('uncaughtException', function (err) {
      if (process.env.DEBUG) {
        console.error(err);
      }
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();