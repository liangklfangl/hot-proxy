'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _lodash = require('lodash');

var _npm = require('npm');

var _npm2 = _interopRequireDefault(_npm);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _typedi = require('typedi');

var _services = require('../services');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PluginManager {
  /**
   * AppInfoService
   * @param {*} appInfoService 
   */
  constructor(appInfoService) {
    Object.defineProperty(this, 'storage', {
      enumerable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, 'plugins', {
      enumerable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, 'dir', {
      enumerable: true,
      writable: true,
      value: ""
    });

    this.dir = _path2.default.join(appInfoService.getProxyDataDir(), 'plugins');
    this.storage = new _storage2.default(this.getDir());
    this.plugins = this.storage.get().filter(p => !p.disabled).reduce((prev, curr) => {
      try {
        const pluginPath = this.getPluginDir(curr.name);
        if (!_fs2.default.existsSync(pluginPath)) {
          throw Error(`plugin ${curr.name} not found`);
        }
        const pluginClass = require(pluginPath);
        prev[curr.name] = new pluginClass();
      } catch (error) {
        console.error(`plugin "${curr.name}" has a runtime error. please check it.\n${error.stack}`);
        process.exit(-1);
      }
      return prev;
    }, {});
  }
  add(pluginName, npmConfig = {}) {
    return new _promise2.default((resolve, reject) => {
      const install = () => {
        _npm2.default.install(pluginName, this.getDir(), err => {
          if (err) {
            if (err.code === 'E404') {
              return reject(Error(`插件不存在 ${err.uri}`));
            }
            return reject(err);
          }
          const plugins = (0, _lodash.uniqWith)(this.storage.get().concat([{
            name: pluginName
          }]), (p1, p2) => {
            return p1.name === p2.name;
          });
          this.storage.set(plugins);
          return resolve(plugins);
        });
      };
      npmConfig = (0, _assign2.default)({}, npmConfig, {
        loglevel: 'silent',
        prefix: this.getDir()
      });
      if (_npm2.default.config.loaded) {
        (0, _keys2.default)(npmConfig).forEach(k => {
          _npm2.default.config.set(k, npmConfig[k]);
        });
        install();
      } else {
        _npm2.default.load(npmConfig, () => install());
      }
    });
  }
  remove(pluginName) {
    return new _promise2.default((resolve, reject) => {
      const uninstall = () => {
        _npm2.default.uninstall(pluginName, this.getDir(), err => {
          if (err) {
            return reject(err);
          }
          const plugins = this.storage.get();
          (0, _lodash.remove)(plugins, p => p.name === pluginName);
          this.storage.set(plugins);
          return resolve(plugins);
        });
      };
      const npmConfig = { loglevel: 'silent', prefix: this.getDir() };
      if (_npm2.default.config.loaded) {
        (0, _keys2.default)(npmConfig).forEach(k => {
          _npm2.default.config.set(k, npmConfig[k]);
        });
        uninstall();
      } else {
        _npm2.default.load(npmConfig, () => uninstall());
      }
    });
  }

  setAttrs(pluginName, attrs) {
    let plugins = this.storage.get();
    plugins = plugins.map(p => {
      if (p.name === pluginName) {
        p = (0, _assign2.default)(p, attrs);
      }
      return p;
    });
    this.storage.set(plugins);
  }

  has(name) {
    return !!this.plugins[name];
  }

  getUIApp() {
    var _this = this;

    const app = new _koa2.default();
    app.use((0, _koaBodyparser2.default)());

    (0, _keys2.default)(this.plugins).forEach(name => {
      const plugin = this.plugins[name];
      if (plugin.manage) {
        const pluginApp = plugin.manage();
        if (Object.prototype.toString.call(pluginApp) === '[object Object]' && pluginApp.__proto__.constructor.name === 'Application') {
          app.use((0, _koaMount2.default)(`/${name}`, pluginApp));
        } else {
          console.error(`"${name}" 插件的 manage() 方法需要返回 koa 实例`);
          process.exit(-1);
        }
      }
    });

    const router = new _koaRouter2.default();
    router.post('/remove', (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { name } = ctx.request.body;
        yield _this.remove(name);
        ctx.body = {
          message: 'ok',
          status: 200
        };
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
    router.get('/list', (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx) {
        ctx.body = {
          data: _this.storage.get().map(function (plugin) {
            return (0, _assign2.default)({}, plugin, require(_path2.default.join(_this.getPluginDir(plugin.name), './package.json')));
          }),
          status: 200
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    router.post('/add', (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { name, registry } = ctx.request.body;
        const npmConfig = {};
        if (registry) {
          npmConfig.registry = registry;
        }
        try {
          yield _this.add(name, npmConfig);
        } catch (err) {
          ctx.status = 400;
          ctx.body = err.message;
          return;
        }
        ctx.body = {
          message: 'ok',
          status: 200
        };
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());

    router.post('/disabled', (() => {
      var _ref4 = (0, _asyncToGenerator3.default)(function* (ctx) {
        const { name, disabled } = ctx.request.body;
        _this.setAttrs(name, { disabled });
        ctx.body = {
          message: 'ok',
          status: 200
        };
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
    app.use(router.routes()).use(router.allowedMethods());
    return app;
  }

  loadProxyMiddleware(server) {
    (0, _keys2.default)(this.plugins).forEach(name => {
      const plugin = this.plugins[name];
      server.use(plugin.proxy(server));
    });
  }

  getDir() {
    return this.dir;
  }

  getPluginDir(pluginName) {
    return _path2.default.resolve(this.getDir(), 'node_modules', pluginName);
  }
}
exports.default = PluginManager;