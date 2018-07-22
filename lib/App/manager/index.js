'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Manager = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaQs = require('koa-qs');

var _koaQs2 = _interopRequireDefault(_koaQs);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _typedi = require('typedi');

var _pluginManager = require('../plugin-manager');

var _pluginManager2 = _interopRequireDefault(_pluginManager);

var _services = require('../services');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Manager {

  constructor() {
    this.httpTrafficService = new _services.HttpTrafficService();
    this.configureService = new _services.ConfigureService();
    this.profileService = new _services.ProfileService();
    this.hostService = new _services.HostService();
    this.mockDataService = new _services.MockDataService();
    this.ruleService = new _services.RuleService();
    this.pluginManager = new _pluginManager2.default();
    // 初始化koa
    this.app = new _koa2.default();
    // query string
    (0, _koaQs2.default)(this.app);
    // body解析
    this.app.use((0, _koaBodyparser2.default)());
    // 路由
    this.app.use((() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
        // 取用户Id
        const cookies = _cookie2.default.parse(ctx.request.headers.cookie || '');
        ctx.userId = cookies.userId || 'root';
        yield next();
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })());
    this.app.use((0, _router2.default)());
    // 静态资源服务
    this.app.use((0, _koaStatic2.default)(_path2.default.join(__dirname, '../../../site')));
    this.app.use((0, _koaMount2.default)('/plugins', this.pluginManager.getUIApp()));
    // 创建server
    this.server = _http2.default.createServer(this.app.callback());
    // socketio
    this.io = new _socket2.default(this.server);

    // 初始化socket io
    this._initTraffic();
    this._initManger();
  }

  listen(port) {
    // 启动server
    this.server.listen(port);
  }

  // http流量监控界面
  _initTraffic() {
    const socket = this.io.of('/httptrafic');
    // 客户端发起连接请求
    socket.on('connection', client => {
      const userId = this._getUserId(client);
      client.join(userId);

      this.httpTrafficService.incMonitor(userId);
      // 推送过滤器，状态
      const state = this.httpTrafficService.getStatus(userId);
      client.emit('state', state);
      const filter = this.httpTrafficService.getFilter(userId);
      client.emit('filter', filter);
      client.emit('clear');
      client.on('disconnect', () => {
        this.httpTrafficService.decMonitor(userId);
      });
    });

    // 监听logRespository事件
    this.httpTrafficService.on('traffic', (userId, rows) => {
      socket.to(userId).emit('rows', rows);
    });
    // 过滤器改变
    this.httpTrafficService.on('filter', (userId, filter) => {
      socket.to(userId).emit('filter', filter);
    });
    // 状态改变
    this.httpTrafficService.on('state-change', (userId, state) => {
      socket.to(userId).emit('state', state);
    });
    // 清空
    this.httpTrafficService.on('clear', userId => {
      socket.to(userId).emit('clear');
      const state = this.httpTrafficService.getStatus(userId);
      socket.to(userId).emit('state', state);
    });
  }

  // 管理界面 使用的功能
  _initManger() {
    var _this = this;

    const socket = this.io.of('/manager');

    // 注册通知
    socket.on('connection', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (client) {
        // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
        const userId = _this._getUserId(client);
        client.join(userId);
        // 推送最新数据
        // proxy配置
        const config = yield _this.configureService.getConfigure();
        client.emit('configure', config);
        // 个人配置
        const profile = yield _this.profileService.getProfile(userId);
        client.emit('profile', profile);
        const mappedClientIps = yield _this.profileService.getClientIpsMappedToUserId(userId);
        client.emit('mappedClientIps', mappedClientIps);
        // host文件列表
        const hostFileList = yield _this.hostService.getHostFileList(userId);
        client.emit('hostfilelist', hostFileList);
        // 规则列表
        const ruleFileList = yield _this.ruleService.getRuleFileList(userId);
        client.emit('rulefilelist', ruleFileList);
        // 数据文件列表
        const dataList = yield _this.mockDataService.getMockDataList(userId);
        client.emit('datalist', dataList);
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })());
    // proxy配置信息
    this.configureService.on('data-change', (userId, configure) => {
      socket.to(userId).emit('configure', configure);
    });
    // 个人配置信息
    this.profileService.on('data-change-profile', (userId, profile) => {
      socket.to(userId).emit('profile', profile);
    });
    this.profileService.on('data-change-clientIpUserMap', (userId, clientIpList) => {
      socket.to(userId).emit('mappedClientIps', clientIpList);
    });
    // host文件变化
    this.hostService.on('data-change', (userId, hostFilelist) => {
      socket.to(userId).emit('hostfilelist', hostFilelist);
    });
    // 规则文件列表
    this.ruleService.on('data-change', (userId, ruleFilelist) => {
      socket.to(userId).emit('rulefilelist', ruleFilelist);
    });
    // mock文件列表
    this.mockDataService.on('data-change', (userId, dataFilelist) => {
      socket.to(userId).emit('datalist', dataFilelist);
    });
  }

  // 通用函数，获取web socket连接中的用户id
  _getUserId(socketIOConn) {
    const cookies = _cookie2.default.parse(socketIOConn.request.headers.cookie || '');
    return cookies.userId || 'root';
  }
}
exports.Manager = Manager;