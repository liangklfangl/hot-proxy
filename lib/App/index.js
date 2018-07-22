'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typedi = require('typedi');

var _manager = require('./manager');

var _proxy = require('./proxy');

var _services = require('./services');

class App {
    constructor() {
        this.proxy = new _proxy.Proxy();
        this.manager = new _manager.Manager();
    }
    init() {
        this.proxy.init();
    }
    start(proxyPort = 8001, managerPort = 40001) {
        this.proxy.ignore(`127.0.0.1:${managerPort}`);
        // 代理端口忽略managerPort
        this.proxy.ignore(`${appInfoService.getPcIp()}:${managerPort}`);
        this.proxy.listen(proxyPort);
        // 代理服务器监听
        this.manager.listen(managerPort);
        // 非代理服务器监听
        appInfoService.setHttpProxyPort(proxyPort);
        appInfoService.setRealUiPort(managerPort);
        appInfoService.printRuntimeInfo();
        // 代理服务器和真实服务器监听端口设置
    }
}
exports.default = App;