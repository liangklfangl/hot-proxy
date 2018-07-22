'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _lodash = require('lodash');

var _nodeLocalstorage = require('node-localstorage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const key = 'hot-plugins';
class PluginStorage {
  constructor(path = __dirname) {
    Object.defineProperty(this, 'store', {
      enumerable: true,
      writable: true,
      value: {}
    });

    this.store = new _nodeLocalstorage.LocalStorage(path);
  }

  set(value) {
    this.store.setItem(key, (0, _stringify2.default)(value));
  }

  get() {
    let plugins = this.store.getItem(key) || [];
    if ((0, _lodash.isString)(plugins)) {
      plugins = JSON.parse(plugins);
    }
    return plugins;
  }
}
exports.default = PluginStorage;