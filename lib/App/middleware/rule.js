'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rule = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mimeTypes = require('mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fsExists = p => {
  return new _promise2.default(resolve => {
    _fs2.default.exists(p, exists => resolve(exists));
  });
};

const rule = exports.rule = ({
  ruleService,
  mockDataService,
  profileService
}) => {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      if (!profileService.enableRule(ctx.userID)) {
        yield next();
        return;
      }
      const { userID } = ctx;
      const { req } = ctx;
      const { method, url } = req;
      const urlObj = _url2.default.parse(url);
      const processRule = ruleService.getProcessRule(userID, method, urlObj);
      if (!processRule) {
        yield next();
        return;
      }
      ctx.res.setHeader('zan-proxy-rule-match', processRule.match);
      if (urlObj.pathname && _mimeTypes2.default.lookup(urlObj.pathname)) {
        ctx.res.setHeader('Content-Type', _mimeTypes2.default.lookup(urlObj.pathname));
      }
      // 规则的响应头先缓存在这里
      const resHeaders = {};
      for (const action of processRule.actionList) {
        const { data } = action;
        switch (action.type) {
          case 'mockData':
            const { dataId } = data;
            const content = yield mockDataService.getDataFileContent(userID, dataId);
            const contentType = yield mockDataService.getDataFileContentType(userID, dataId);
            ctx.res.body = content;
            ctx.res.setHeader('Content-Type', contentType);
            break;
          case 'addRequestHeader':
            ctx.req.headers[data.headerKey] = data.headerValue;
            break;
          case 'addResponseHeader':
            resHeaders[data.headerKey] = data.headerValue;
            break;
          case 'empty':
            ctx.res.body = '';
            break;
          case 'redirect':
            const target = profileService.calcPath(userID, urlObj.href, processRule.match, data.target);
            if (!target) {
              continue;
            }
            ctx.res.setHeader('zan-proxy-target', target);
            if (target.startsWith('http') || target.startsWith('ws')) {
              ctx.req.url = target;
            } else {
              const exists = yield fsExists(target);
              if (exists) {
                ctx.res.body = _fs2.default.createReadStream(target);
              } else {
                ctx.res.body = `target ${target} does not exist`;
                ctx.res.statusCode = 404;
              }
            }
            break;
          default:
            break;
        }
      }
      yield next();
      (0, _keys2.default)(resHeaders).forEach(function (headerKey) {
        ctx.res.setHeader(headerKey, resHeaders[headerKey]);
      });
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};