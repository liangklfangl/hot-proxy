import http from 'http';
import fillReqUrl from './fillReqUrl';

export class HttpServer {
  server ={};
  constructor() {
    this.server = http.createServer();
  }
  setHttpHandler(httpHandler) {
    this.server.on('request', httpHandler.handle.bind(httpHandler));
  }
  setConnectHandler(connectHandler) {
    this.server.on('connect', connectHandler.handle.bind(connectHandler));
  }
  setUpgradeHandler(upgradeHandler) {
    this.server.on('upgrade', (req, socket, head) => {
      fillReqUrl(req, 'ws');
      upgradeHandler.handle(req, socket, head);
    });
  }
  setErrorHandler(errorHandler) {
    this.server.on('error', errorHandler.handle.bind(errorHandler));
  }
  listen(port) {
    this.server.listen(port, '0.0.0.0');
  }
}
