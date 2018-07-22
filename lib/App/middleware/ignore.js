"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ignorer = undefined;

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Ignorer {
  constructor() {
    Object.defineProperty(this, "patterns", {
      enumerable: true,
      writable: true,
      value: []
    });
  }
  /**
   * 忽略集合
   */


  /**
   * 忽略的模式
   */
  addPattern(pattern) {
    this.patterns.push(pattern);
  }

  /**
   * 
   * @param {*} ctx 
   * @param {*} next 
   * 忽略某一个请求
   */
  middleware(ctx, next) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let shouldIgnore = false;
      for (const pattern of _this.patterns) {
        if (ctx.req.url.includes(pattern)) {
          shouldIgnore = true;
          break;
        }
      }
      if (shouldIgnore) {
        ctx.ignore = true;
      }
      yield next();
    })();
  }
}
exports.Ignorer = Ignorer;