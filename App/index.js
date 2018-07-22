import { Container, Inject, Service } from 'typedi';
import { Manager } from './manager';
import { Proxy } from './proxy';
import { AppInfoService } from './services';

export default class App {
    constructor(){
        this.proxy = Proxy;
    }
    init(){
       this.proxy.init();
    }
    start(proxyPort = 8001, managerPort = 40001){
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