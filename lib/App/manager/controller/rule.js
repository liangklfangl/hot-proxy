'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleController = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RuleController {
  constructor() {
    Object.defineProperty(this, 'ruleService', {
      enumerable: true,
      writable: true,
      value: new _services.RuleService()
    });
    Object.defineProperty(this, 'profileService', {
      enumerable: true,
      writable: true,
      value: new _services.ProfileService()
    });
  }

  regist(router) {
    var _this = this;

    // 创建规则
    // {
    //    name:name,
    //    description:description
    // }
    const ruleRouter = new _koaRouter2.default({
      prefix: '/rule'
    });
    ruleRouter.post('/create', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        try {
          const result = yield _this.ruleService.createRuleFile(userId, ctx.request.body.name, ctx.request.body.description);
          ctx.body = {
            code: 0,
            msg: result
          };
          return;
        } catch (error) {
          const msg = error === _services.ErrNameExists ? '文件已存在' : `未知错误: ${error.toString()}`;
          ctx.body = {
            code: 1,
            msg
          };
        }
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
    // 获取规则文件列表
    // /rule/filelist
    ruleRouter.get('/filelist', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const ruleFileList = yield _this.ruleService.getRuleFileList(userId);
        ctx.body = {
          code: 0,
          list: ruleFileList
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    // 删除规则文件
    // /rule/deletefile?name=${name}
    ruleRouter.get('/deletefile', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.ruleService.deleteRuleFile(userId, ctx.query.name);
        ctx.body = {
          code: 0
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    // 设置文件勾选状态
    // /rule/setfilecheckstatus?name=${name}&checked=${checked?1:0}
    ruleRouter.get('/setfilecheckstatus', ctx => {
      const userId = ctx.userId;
      this.ruleService.setRuleFileCheckStatus(userId, ctx.query.name, parseInt(ctx.query.checked, 10) === 1 ? true : false);
      ctx.body = {
        code: 0
      };
    });
    // 设置文件勾选状态
    // /rule/setfiledisablesync?name=${name}&diable=${disable?1:0}
    ruleRouter.get('/setfiledisablesync', ctx => {
      const userId = ctx.userId;
      this.ruleService.setRuleFileDisableSync(userId, ctx.query.name, parseInt(ctx.query.disable, 10) === 1 ? true : false);
      ctx.body = {
        code: 0
      };
    });
    // 获取规则文件
    // /rule/getfile?name=${name}
    ruleRouter.get('/getfile', (() => {
      var _ref4 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const content = yield _this.ruleService.getRuleFile(userId, ctx.query.name);
        ctx.body = {
          code: 0,
          data: content
        };
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
    // 保存规则文件
    // /rule/savefile?name=${name} ,content
    ruleRouter.post('/savefile', (() => {
      var _ref5 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        yield _this.ruleService.saveRuleFile(userId, ctx.request.body);
        ctx.body = {
          code: 0
        };
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })());

    // 重命名规则文件
    // /rule/changefilename/:origin, body -> { name, description }
    ruleRouter.post('/updatefileinfo/:origin', (() => {
      var _ref6 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { userId, params, request } = ctx;
        const { origin } = params;
        const { name, description } = request.body;
        try {
          yield _this.ruleService.updateFileInfo(userId, origin, {
            description,
            name
          });
          ctx.body = {
            code: 0
          };
        } catch (e) {
          const msg = e === _services.ErrNameExists ? '有重复名字' : `未知错误: ${e.toString()}`;
          ctx.body = {
            code: 1,
            msg
          };
        }
      });

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    })());

    // 导出规则文件
    // /rule/download?name=${name}
    ruleRouter.get('/download', (() => {
      var _ref7 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const name = ctx.query.name;
        const content = yield _this.ruleService.getRuleFile(userId, name);
        ctx.set('Content-disposition', `attachment;filename=${encodeURI(name)}.json`);
        ctx.body = content;
      });

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    })());
    // 测试规则
    // /rule/test
    ruleRouter.post('/test', (() => {
      var _ref8 = (0, _asyncToGenerator3.default)(function* (ctx) {
        /*
               url: '',// 请求url
               match: '',// url匹配规则
               targetTpl: '',// 路径模板， 会用urlReg的匹配结果来替换targetTpl $1 $2
               matchRlt: '',// url匹配结果
               targetRlt: ''// 路径匹配结果
               */
        const userId = ctx.userId;
        const match = ctx.request.body.match;
        const url = ctx.request.body.url;
        let matchRlt = '不匹配';

        if (match && (url.indexOf(match) >= 0 || new RegExp(match).test(url))) {
          matchRlt = 'url匹配通过';
        }

        const targetTpl = ctx.request.body.targetTpl;
        const targetRlt = yield _this.profileService.calcPath(userId, url, match, targetTpl);

        // 测试规则
        ctx.body = {
          code: 0,
          data: {
            matchRlt,
            targetRlt
          }
        };
      });

      return function (_x8) {
        return _ref8.apply(this, arguments);
      };
    })());

    ruleRouter.get('/import', (() => {
      var _ref9 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { userId, query } = ctx;
        const ruleFileUrl = query.url;
        try {
          const ruleFile = yield _this.ruleService.importRemoteRuleFile(userId, ruleFileUrl);
          ctx.body = {
            code: 0,
            data: ruleFile
          };
        } catch (e) {
          ctx.body = {
            code: 1,
            msg: e
          };
        }
      });

      return function (_x9) {
        return _ref9.apply(this, arguments);
      };
    })());

    ruleRouter.get('/copy', (() => {
      var _ref10 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const userId = ctx.userId;
        const name = ctx.query.name;
        const copied = yield _this.ruleService.copyRuleFile(userId, name);
        ctx.body = {
          code: 0,
          data: copied
        };
      });

      return function (_x10) {
        return _ref10.apply(this, arguments);
      };
    })());
    router.use(ruleRouter.routes(), ruleRouter.allowedMethods());
  }
}
exports.RuleController = RuleController;