'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MockDataController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MockDataController {
  constructor() {
    Object.defineProperty(this, 'mockDataService', {
      enumerable: true,
      writable: true,
      value: new _services.MockDataService()
    });
    Object.defineProperty(this, 'httpTrafficService', {
      enumerable: true,
      writable: true,
      value: new _services.HttpTrafficService()
    });
  }

  regist(router) {
    var _this = this;

    // 获取mock数据列表
    router.get('/data/getdatalist', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const dataList = yield _this.mockDataService.getMockDataList(userId);
        ctx.body = {
          code: 0,
          data: dataList
        };
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
    // 保存数据列表
    router.post('/data/savedatalist', ctx => {
      const userId = ctx.userId;
      this.mockDataService.saveMockDataList(userId, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });

    // 读取数据文件
    router.get('/data/getdatafile', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const content = yield _this.mockDataService.getDataFileContent(userId, ctx.query.id);
        ctx.body = {
          code: 0,
          data: content
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    // 保存数据文件
    router.post('/data/savedatafile', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.mockDataService.saveDataFileContent(userId, ctx.query.id, ctx.request.body.content);
        ctx.body = {
          code: 0
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    // 从http请求日志中保存 mock 数据
    router.post('/data/savedatafromtraffic', (() => {
      var _ref4 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;

        const content = yield _this.httpTrafficService.getResponseBody(userId, ctx.request.body.reqid);
        // 获取数据文件内容 在保存
        yield _this.mockDataService.saveDataEntryFromTraffic(userId, ctx.request.body.id, ctx.request.body.name, ctx.request.body.contenttype, content);
        ctx.body = {
          code: 0
        };
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
  }
}
exports.MockDataController = MockDataController;