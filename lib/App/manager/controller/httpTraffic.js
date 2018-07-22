'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpTrafficController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HttpTrafficController {
  constructor() {
    Object.defineProperty(this, 'httpTrafficService', {
      enumerable: true,
      writable: true,
      value: new _services.HttpTrafficService()
    });
  }

  regist(router) {
    var _this = this;

    // 获取响应body
    router.get('/traffic/getResponseBody', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const id = ctx.query.id;
        const content = yield _this.httpTrafficService.getResponseBody(userId, id);
        ctx.body = content;
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());

    router.get('/traffic/getRequestBody', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const id = ctx.query.id;
        const content = yield _this.httpTrafficService.getRequestBody(userId, id);
        ctx.body = content;
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());

    router.get('/traffic/stopRecord', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const stopRecord = ctx.query.stop;
        yield _this.httpTrafficService.setStopRecord(userId, stopRecord.toString() === 'true');
        ctx.body = {
          code: 0
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    router.get('/traffic/setfilter', (() => {
      var _ref4 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const { filter = '' } = ctx.query;
        yield _this.httpTrafficService.setFilter(userId, filter);
        ctx.body = {
          code: 0
        };
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());

    router.get('/traffic/clear', (() => {
      var _ref5 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.httpTrafficService.clear(userId);
        ctx.body = {
          code: 0
        };
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })());

    // 获取请求body
    router.get('/traffic/getRequestBody', (() => {
      var _ref6 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const id = ctx.query.id;
        const content = yield _this.httpTrafficService.getRequestBody(userId, id);
        ctx.body = content;
      });

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    })());
  }
}
exports.HttpTrafficController = HttpTrafficController;