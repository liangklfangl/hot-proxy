'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.host = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const host = exports.host = (hostService, profileService) => {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      if (!profileService.enableHost(ctx.userID)) {
        yield next();
        return;
      }
      const { req, res } = ctx;
      if (!((0, _lodash.isNull)(res.body) || (0, _lodash.isUndefined)(res.body))) {
        yield next();
        return;
      }
      const url = _url2.default.parse(req.url);
      url.hostname = yield hostService.resolveHost(ctx.userID, url.hostname);
      url.host = url.hostname;
      if (url.port) {
        url.host = `${url.host}:${url.port}`;
      }
      req.url = _url2.default.format(url);
      yield next();
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};