'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ip = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 对请求进行拦截获取到ip地址封装到clientIp上
 */
const ip = exports.ip = () => {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      const req = ctx.req;
      ctx.clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
      yield next();
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};