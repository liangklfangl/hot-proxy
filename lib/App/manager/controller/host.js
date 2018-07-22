'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _services = require('./../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HostController {
  constructor() {
    Object.defineProperty(this, 'hostService', {
      enumerable: true,
      writable: true,
      value: new _services.HostService()
    });
  }

  regist(router) {
    var _this = this;

    // {
    //    name:name,
    //    description:description
    // }
    router.post('/host/create', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;

        const result = yield _this.hostService.createHostFile(userId, ctx.request.body.name, ctx.request.body.description);
        ctx.body = {
          code: result ? 0 : 1,
          msg: result ? '' : '文件已存在'
        };
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
    router.get('/host/filelist', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const hostList = yield _this.hostService.getHostFileList(userId);
        ctx.body = {
          code: 0,
          list: hostList
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    // /host/deletefile?name=${name}
    router.get('/host/deletefile', ctx => {
      const userId = ctx.userId;
      this.hostService.deleteHostFile(userId, ctx.query.name);
      ctx.body = {
        code: 0
      };
    });
    // /host/togglefile?name=${name}
    router.get('/host/togglefile', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const { name } = ctx.query;
        yield _this.hostService.toggleUseHost(userId, name);
        ctx.body = {
          code: 0
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    // /host/getfile?name=${name}
    router.get('/host/getfile', (() => {
      var _ref4 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const hostFile = yield _this.hostService.getHostFile(userId, ctx.query.name);
        ctx.body = {
          code: 0,
          data: hostFile
        };
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
    // /host/savefile?name=${name} ,content
    router.post('/host/savefile', (() => {
      var _ref5 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.hostService.saveHostFile(userId, ctx.query.name, ctx.request.body);
        ctx.body = {
          code: 0
        };
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })());

    router.get('/host/download', (() => {
      var _ref6 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const name = ctx.query.name;
        const content = yield _this.hostService.getHostFile(userId, name);
        ctx.set('Content-disposition', `attachment;filename=${encodeURI(name)}.json`);
        ctx.body = content;
      });

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    })());

    router.get('/host/import', (() => {
      var _ref7 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { userId, query } = ctx;
        const hostFileUrl = query.url;
        try {
          const hostFile = yield _this.hostService.importRemoteHostFile(userId, hostFileUrl);
          ctx.body = {
            code: 0,
            data: hostFile
          };
        } catch (e) {
          ctx.body = {
            code: 1,
            msg: e
          };
        }
      });

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    })());
  }
}
exports.HostController = HostController;