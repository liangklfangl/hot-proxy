'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _services = require('./../App/services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const syncRemoteRules = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
    console.log('开始同步远程规则集');
    const appInfoService = new _services.AppInfoService(false);
    const ruleService = new _services.RuleService(appInfoService);
    const userIDs = (0, _keys2.default)(ruleService.rules);
    for (const userID of userIDs) {
      const userRuleFilesMap = ruleService.rules[userID];
      const userRuleFiles = (0, _keys2.default)(userRuleFilesMap).map(function (k) {
        return userRuleFilesMap[k];
      });
      for (const ruleFile of userRuleFiles) {
        if (ruleFile.meta && ruleFile.meta.remote && !ruleFile.disableSync) {
          const spinner = (0, _ora2.default)(`同步规则集${ruleFile.name}`).start();
          try {
            yield ruleService.importRemoteRuleFile(userID, ruleFile.meta.url);
            spinner.succeed();
          } catch (e) {
            spinner.fail();
          }
        }
      }
    }
    console.log('同步远程规则集结束');
  });

  return function syncRemoteRules() {
    return _ref.apply(this, arguments);
  };
})();

exports.default = syncRemoteRules;