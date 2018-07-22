'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actualRequest = exports.endPoint = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _inflation = require('inflation');

var _inflation2 = _interopRequireDefault(_inflation);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 * @param {*} httpTrafficService 
 * 接受一个HttpTrafficService实例
 */
const endPoint = exports.endPoint = httpTrafficService => {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      const { userID } = ctx;
      const urlObj = _url2.default.parse(ctx.req.url);
      const requestID = httpTrafficService.getRequestId(userID, urlObj);
      if (requestID > 0 && httpTrafficService.hasMonitor(userID)) {
        ctx.requestID = requestID;
        yield httpTrafficService.requestBegin({
          clientIp: ctx.clientIP,
          headers: ctx.req.headers,
          httpVersion: ctx.req.httpVersion,
          id: requestID,
          method: ctx.req.method,
          urlObj,
          userId: userID
        });
      }
      const receiveRequestTime = Date.now();
      yield next();
      if (requestID > 0 && httpTrafficService.hasMonitor(userID)) {
        const { res, remoteRequestBeginTime, remoteResponseStartTime } = ctx;
        const requestEndTime = Date.now();
        const { statusCode } = res;
        const headers = res._headers;
        getResponseBody(res).then(function (body) {
          httpTrafficService.serverReturn({
            id: requestID,
            toClientResponse: {
              body,
              headers,
              receiveRequestTime,
              remoteIp: urlObj.host,
              remoteRequestBeginTime,
              remoteResponseStartTime,
              requestEndTime,
              statusCode
            },
            userId: userID
          });
        });
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};

const actualRequest = exports.actualRequest = httpTrafficService => {
  return (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (ctx, next) {
      if (ctx.ignore) {
        yield next();
        return;
      }
      const { userID, requestID } = ctx;
      if (requestID > 0 && httpTrafficService.hasMonitor(userID)) {
        const url = _url2.default.parse(ctx.req.url);
        const { headers, method, httpVersion } = ctx.req;
        getRequestBody(ctx.req).then(function (body) {
          httpTrafficService.actualRequest({
            id: requestID,
            originBody: body,
            requestData: {
              body,
              headers,
              httpVersion,
              method,
              path: url.path,
              port: url.port || 80,
              protocol: url.protocol
            },
            userId: userID
          });
        });
      }
      ctx.remoteRequestBeginTime = Date.now();
      yield next();
      ctx.remoteResponseStartTime = Date.now();
    });

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  })();
};

const getRequestBody = (() => {
  var _ref3 = (0, _asyncToGenerator3.default)(function* (req) {
    if (req.body) {
      return _promise2.default.resolve(req.body);
    }
    return new _promise2.default(function (resolve, reject) {
      (0, _rawBody2.default)((0, _inflation2.default)(req), 'utf-8', function (err, body) {
        if (err) {
          return reject(err);
        } else {
          return resolve(body);
        }
      });
    });
  });

  return function getRequestBody(_x5) {
    return _ref3.apply(this, arguments);
  };
})();

const getResponseBody = (() => {
  var _ref4 = (0, _asyncToGenerator3.default)(function* (res) {
    const { body } = res;
    if (!body) {
      return _promise2.default.resolve('');
    }
    if (Buffer.isBuffer(body)) {
      return _promise2.default.resolve(body.toString('utf-8'));
    }
    if ('string' === typeof body) {
      return _promise2.default.resolve(body);
    }
    if (body instanceof _stream2.default) {
      return new _promise2.default(function (resolve, reject) {
        (0, _rawBody2.default)((0, _inflation2.default)(body), 'utf-8', function (err, text) {
          if (err) {
            return reject(err);
          } else {
            return resolve(text);
          }
        });
      });
    }
  });

  return function getResponseBody(_x6) {
    return _ref4.apply(this, arguments);
  };
})();