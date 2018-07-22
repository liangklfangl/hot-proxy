#!/usr/bin/env node
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let run = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
    //   if (program.update) {
    //     await selfUpdate();
    //   }
    //   if (program.sync) {
    //     await syncRule();
    //     await syncHost();
    //   }
    const managerPort = _commander2.default.manager_port || 40001;
    const url = `http://${_ip2.default.address()}:${managerPort}`;
    yield (0, _start2.default)(_commander2.default.proxy_port, _commander2.default.manager_port);
    (0, _open2.default)(url);
  });

  return function run() {
    return _ref.apply(this, arguments);
  };
})();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _start = require('./start');

var _start2 = _interopRequireDefault(_start);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import syncHost from './syncHost';
// import syncRule from './syncRule';


// import 'reflect-metadata';
const packageInfo = require('../package.json');
// import selfUpdate from './selfUpdate';

_commander2.default.version(packageInfo.version).description('start ZanProxy server').option('-p, --proxy_port [value]', 'set the proxy port').option('-m, --manager_port [value]', 'set the manager server port').option('--no-update', 'do not check if update available').option('--no-sync', 'do not sync remote rules').parse(process.argv);

run();