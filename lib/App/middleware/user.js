"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.user = undefined;

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 * @param {*} profileService 
 * 获取用户信息的service
 */
const user = exports.user = profileService => {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      ctx.userID = profileService.getClientIpMappedUserId(ctx.clientIP);
      yield next();
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};