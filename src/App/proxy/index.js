import { Container, Service } from 'typedi';
import { ProxyServer } from '../../ProxyServer';
import {
  actualRequest,
  endPoint,
  host,
  Ignorer,
  ip,
  rule,
  user,
} from '../middleware';
import PluginManager from '../plugin-manager';
import {
  HostService,
  HttpTrafficService,
  MockDataService,
  ProfileService,
  RuleService,
} from '../services';


export default class Proxy{
    server ;
    ignorer;
    
    /**
     * 监听端口号
     */
    async listen(port) {
      this.server.listen(port);
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
    async init() {
      this.server = await ProxyServer.create();
      this.ignorer = new Ignorer();
      this.server.use(this.ignorer.middleware.bind(this.ignorer));
      // 添加中间件ignore
      this.server.use(ip());
      // 添加中间件ip
      this.server.use(user(ProfileService));
      this.server.use(endPoint(HttpTrafficService));
      this.server.use(
        rule({
          mockDataService: MockDataService,
          profileService: ProfileService,
          ruleService: RuleService,
        }),
      );
      const pluginManager = new PluginManager();
      pluginManager.loadProxyMiddleware(this.server);
      this.server.use(
        host(HostService, ProfileService),
      );
      this.server.use(actualRequest(HttpTrafficService));
  }
}