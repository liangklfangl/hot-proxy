'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _services = require('./../App/services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const syncRemoteHosts = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
    console.log('开始同步远程Host文件');
    const appInfoService = new _services.AppInfoService(false);
    const hostService = new _services.HostService(appInfoService);
    const hostFileList = hostService.getHostFileList('root');
    for (const hostFile of hostFileList) {
      if (!hostFile.meta) {
        continue;
      }
      if (!hostFile.meta.url || hostFile.meta.local) {
        continue;
      }
      const spinner = (0, _ora2.default)(`同步远程Host${hostFile.name}`).start();
      try {
        yield hostService.importRemoteHostFile('root', hostFile.meta.url);
        spinner.succeed();
      } catch (e) {
        spinner.fail();
      }
    }
    console.log('同步远程Host文件结束');
  });

  return function syncRemoteHosts() {
    return _ref.apply(this, arguments);
  };
})();

exports.default = syncRemoteHosts;