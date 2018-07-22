'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfigController {
  constructor() {
    Object.defineProperty(this, 'confService', {
      enumerable: true,
      writable: true,
      value: new _services.ConfigureService()
    });
  }

  regist(router) {
    var _this = this;

    router.post('/configure/savefile', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.confService.setConfigure(userId, ctx.request.body);
        ctx.body = {
          code: 0
        };
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  }
}
exports.ConfigController = ConfigController;