'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfileController {
  constructor() {
    Object.defineProperty(this, 'profileService', {
      enumerable: true,
      writable: true,
      value: new _services.ProfileService()
    });
  }

  regist(router) {
    var _this = this;

    router.post('/profile/savefile', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.profileService.setProfile(userId, ctx.request.body);
        ctx.body = {
          code: 0
        };
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());

    router.post('/profile/setRuleState', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.profileService.setEnableRule(userId, !!ctx.query.rulestate);
        ctx.body = {
          code: 0
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());

    router.post('/profile/setHostState', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.profileService.setEnableHost(userId, !!ctx.query.hoststate);
        ctx.body = {
          code: 0
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
  }
}
exports.ProfileController = ProfileController;