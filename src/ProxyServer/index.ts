import getPort from 'get-port';
import compose from 'koa-compose';
import LRU from 'lru-cache';
import path from 'path';
import {
  CertificateService,
  CertificateStorage,
  ConnectHandler,
  Forwarder,
  HttpHandler,
  UpgradeHandler,
} from './impl';
// import {
//   Cache,
//   CertificateService as ICertificateService,
//   CertificateStorage as ICertificateStorage,
//   ConnectHandler as IConnectHandler,
//   Forwarder as IForwarder,
//   HttpHandler as IHttpHandler,
//   middleware,
//   UpgradeHandler as IUpgradeHandler,
// } from './interfaces';
import { HttpServer, HttpsServer } from './servers';

export class ProxyServer {
  static async create() {
    const proxyServer = new ProxyServer();
    await proxyServer.init();
    return proxyServer;
  }

   middleware = [];
   cache = {};
   forwarder = {};
   cert=  {
    service:{},
    storage:{}
  };
   handlers =  {
    http:{},
    connect:{},
    upgrade:{}
  };

   httpProxyServer = {};
   httpsProxyServer = {};

   httpsPort = 0;

  async listen(port = 8001) {
    const handlerMiddleware = compose(
      this.middleware.concat([
        async ctx => {
          await this.forwarder.forward(ctx);
        },
      ]),
    );
    this.handlers.connect.httpPort = port;
    this.handlers.http.setMiddleware(handlerMiddleware);
    this.handlers.upgrade.setMiddleware(compose(this.middleware));
    this.httpProxyServer.listen(port);
    this.httpsProxyServer.listen(this.httpsPort);
  }

  use(fn: middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function!');
    }
    this.middleware.push(fn);
    return this;
  }

   async init() {
    this.forwarder = new Forwarder();
    this.cache = LRU({
      max: 500,
      maxAge: 1000 * 60 * 60,
    });
    const certStorage = new CertificateStorage(
      path.join(
        process.env.HOME || process.env.USERPROFILE || '~/',
        '.front-end-proxy/certificate',
      ),
    );
    const certService = new CertificateService(certStorage, this.cache);
    this.cert = {
      service: certService,
      storage: certStorage,
    };
    this.httpsPort = await getPort({ port: 8989 });

    this.handlers = {
      connect: new ConnectHandler(this.httpsPort, this.cache),
      http: new HttpHandler(),
      upgrade: new UpgradeHandler(),
    };

    this.httpProxyServer = new HttpServer();
    this.httpsProxyServer = await HttpsServer.create(this.cert.service);
    this.httpProxyServer.setHttpHandler(this.handlers.http);
    this.httpProxyServer.setConnectHandler(this.handlers.connect);
    this.httpProxyServer.setUpgradeHandler(this.handlers.upgrade);

    this.httpsProxyServer.setHttpHandler(this.handlers.http);
    this.httpsProxyServer.setUpgradeHandler(this.handlers.upgrade);
  }
}
