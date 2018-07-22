'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppInfoService extends _events2.default {
  constructor(single = true) {
    super();
    // 用户home目录
    const userHome = process.env.HOME || process.env.USERPROFILE || '/';
    // proxy data存放目录
    this.proxyDataDir = _path2.default.join(userHome, '.front-end-proxy');
    // app信息
    this.appInfo = {
      pcIp: _ip2.default.address(),
      proxyPort: 8001,
      realUiPort: 40001,
      single
    };
    this.appDir = _path2.default.join(__dirname, '../../../');
  }

  getAppDir() {
    return this.appDir;
  }

  /**
   * 设置app 运行信息
   * @param info
   */
  setAppInfo(info) {
    (0, _lodash.assign)(this.appInfo, info);
    this.emit('data-change', this.appInfo);
  }

  /**
   * 是否是单用户模式
   * @returns {boolean|*}
   */
  isSingle() {
    return this.appInfo.single;
  }

  /**
   * 本地存放数据的目录
   * @returns {*}
   */
  getProxyDataDir() {
    return this.proxyDataDir;
  }

  /**
   * 真实的 ui 端口
   * @returns {string}
   */
  getRealUiPort() {
    return this.appInfo.realUiPort;
  }

  /**
   * 设置真实的 ui 端口
   * @param uiport
   */
  setRealUiPort(uiport) {
    this.setAppInfo({
      realUiPort: uiport
    });
  }

  /**
   * 真实的代理端口
   * @returns {string}
   */
  getHttpProxyPort() {
    return this.appInfo.proxyPort;
  }

  /**
   * 设置正在运行的代理端口
   * @param proxyport
   */
  setHttpProxyPort(httpProxyPort) {
    this.setAppInfo({
      proxyPort: httpProxyPort
    });
  }

  /**
   * 获取机器ip
   * @returns {string}
   */
  getPcIp() {
    return this.appInfo.pcIp;
  }

  // 是否是webui请求
  isWebUiRequest(hostname, port) {
    return (hostname === '127.0.0.1' || hostname === this.appInfo.pcIp) && port === this.appInfo.realUiPort;
  }

  printRuntimeInfo() {
    console.log(`Proxy Port: ${this.appInfo.proxyPort}`);
    console.log(`Manager: http://${this.appInfo.pcIp}:${this.appInfo.realUiPort}`);
  }
}
exports.default = AppInfoService;