'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typedi = require('typedi');

var _ProxyServer = require('../../ProxyServer');

var _middleware = require('../middleware');

var _pluginManager = require('../plugin-manager');

var _pluginManager2 = _interopRequireDefault(_pluginManager);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Proxy {

  /**
   * 监听端口号
   */
  listen(port) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      _this.server.listen(port);
    })();
  }

  /**
   * 忽略pattern
   */
  ignore(pattern) {
    this.ignorer.addPattern(pattern);
  }

  /**
   * 实例化proxy
   */
  init() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      _this2.server = yield _ProxyServer.ProxyServer.create();
      _this2.ignorer = new _middleware.Ignorer();
      _this2.server.use(_this2.ignorer.middleware.bind(_this2.ignorer));
      // 添加中间件ignore
      _this2.server.use((0, _middleware.ip)());
      // 添加中间件ip
      _this2.server.use((0, _middleware.user)(_services.ProfileService));
      _this2.server.use((0, _middleware.endPoint)(_services.HttpTrafficService));
      _this2.server.use((0, _middleware.rule)({
        mockDataService: _services.MockDataService,
        profileService: _services.ProfileService,
        ruleService: _services.RuleService
      }));
      const pluginManager = new _pluginManager2.default();
      pluginManager.loadProxyMiddleware(_this2.server);
      _this2.server.use((0, _middleware.host)(_services.HostService, _services.ProfileService));
      _this2.server.use((0, _middleware.actualRequest)(_services.HttpTrafficService));
    })();
  }
}
exports.default = Proxy;