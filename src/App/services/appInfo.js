import EventEmitter from 'events';
import ip from 'ip';
import { assign } from 'lodash';
import path from 'path';

export default class AppInfoService extends EventEmitter{
  constructor(single=true){
    super();
    // 用户home目录
    const userHome = process.env.HOME || process.env.USERPROFILE || '/';
    // proxy data存放目录
    this.proxyDataDir = path.join(userHome, '.front-end-proxy');
    // app信息
    this.appInfo = {
      pcIp: ip.address(),
      proxyPort: 8001,
      realUiPort: 40001,
      single,
    };
    this.appDir = path.join(__dirname, '../../../');
  }

   getAppDir() {
     return this.appDir;
  }

  /**
   * 设置app 运行信息
   * @param info
   */
    setAppInfo(info) {
      assign(this.appInfo, info);
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
           realUiPort: uiport,
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
      proxyPort: httpProxyPort,
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
    return (
      (hostname === '127.0.0.1' || hostname === this.appInfo.pcIp) &&
      port === this.appInfo.realUiPort
    );
  }

   printRuntimeInfo() {
    console.log(`Proxy Port: ${this.appInfo.proxyPort}`);
    console.log(
      `Manager: http://${this.appInfo.pcIp}:${this.appInfo.realUiPort}`,
    );
  }
}

