import EventEmitter from 'events';
import jsonfile from 'jsonfile';
import { assign } from 'lodash';
import path from 'path';
import { Service } from 'typedi';
// import { AppInfoService } from './appInfo';

export class ConfigureService extends EventEmitter {
  configureFile="";
  configure={};
  constructor(appInfoService) {
    super();
    const proxyDataDir = appInfoService.getProxyDataDir();
    this.configureFile = path.join(proxyDataDir, 'configure.json');
    this.configure = assign(
      {},
      {
        gitlabToken: '',
        proxyPort: 8001,
        requestTimeoutTime: 30000,
      },
      jsonfile.readFileSync(this.configureFile),
    );
  }

  // 获取配置
  getConfigure() {
    return this.configure;
  }

  // 设置配置，保存到文件
  async setConfigure(userId, configure) {
    this.configure = configure;

    jsonfile.writeFileSync(this.configureFile, this.configure, {
      encoding: 'utf-8',
    });
    // 发送通知
    this.emit('data-change', userId, this.configure);
  }

  // 获取代理端口
  getProxyPort() {
    return this.configure.proxyPort;
  }
}
