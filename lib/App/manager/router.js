'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const router = new _koaRouter2.default();
  new _controller.ConfigController().regist(router);
  new _controller.ProfileController().regist(router);
  new _controller.HostController().regist(router);
  new _controller.HttpTrafficController().regist(router);
  new _controller.MockDataController().regist(router);
  new _controller.RuleController().regist(router);
  new _controller.UtilsController().regist(router);
  return router.routes();
};

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _typedi = require('typedi');

var _controller = require('./controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }