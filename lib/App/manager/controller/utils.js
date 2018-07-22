'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UtilsController = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _typedi = require('typedi');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UtilsController {
  constructor() {
    Object.defineProperty(this, 'appInfoService', {
      enumerable: true,
      writable: true,
      value: new _services.AppInfoService()
    });
    Object.defineProperty(this, 'hostService', {
      enumerable: true,
      writable: true,
      value: new _services.HostService()
    });
    Object.defineProperty(this, 'ruleService', {
      enumerable: true,
      writable: true,
      value: new _services.RuleService()
    });
  }

  regist(router) {
    var _this = this;

    // 下载证书
    router.get('/utils/rootCA.crt', ctx => {
      ctx.set('Content-disposition', 'attachment;filename=zproxy.crt');
      const filePath = _path2.default.join(this.appInfoService.getProxyDataDir(), 'certificate/root/zproxy.crt.pem');
      ctx.body = _fs2.default.createReadStream(filePath, { encoding: 'utf-8' });
    });

    router.get('/pac', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const ip = _this.appInfoService.getPcIp();
        const port = _this.appInfoService.getHttpProxyPort();

        const matchScripts = [];

        const userIDs = (0, _keys2.default)(_this.ruleService.rules);
        for (const userID of userIDs) {
          const userRuleFilesMap = _this.ruleService.rules[userID];
          const userRuleFiles = (0, _keys2.default)(userRuleFilesMap).map(function (k) {
            return userRuleFilesMap[k];
          });
          for (const ruleFile of userRuleFiles) {
            for (const rule of ruleFile.content) {
              matchScripts.push(`if (url.indexOf("${rule.match}") > -1) { return zProxy; }`);
              matchScripts.push(`try {
                if ((new RegExp("${rule.match}")).test(url)) { return zProxy; }
              } catch(e){}`);
            }
          }

          const hostFileList = _this.hostService.getHostFileList(userID);
          for (const hostFile of hostFileList) {
            const hf = _this.hostService.getHostFile(userID, hostFile.name);
            if (!hf) {
              continue;
            }
            const hostFileContent = hf.content;
            const hosts = (0, _keys2.default)(hostFileContent);
            for (const host of hosts) {
              matchScripts.push(`if ( host == "${host}" ) { return zProxy; }`);
              if (host.startsWith('*')) {
                matchScripts.push(`if ( host.indexOf("${host.substr(1, host.length)}") > -1 ) { return zProxy; } `);
              }
            }
          }
        }
        const pac = `\n\
                        var direct = 'DIRECT;';\n\
                        var zProxy = 'PROXY ${ip}:${port}';\n\
                        function FindProxyForURL(url, host) {\n\
                            ${matchScripts.join('\n')}
                            return direct;\n\
                       }`;
        ctx.set('Content-Type', 'application/x-javascript-config');
        ctx.body = pac;
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());

    router.get('/utils/download', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        _axios2.default.get(ctx.query.url);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
  }
}
exports.UtilsController = UtilsController;