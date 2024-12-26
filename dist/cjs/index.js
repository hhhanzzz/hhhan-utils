"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  loadModule: true,
  loadAllModules: true,
  array: true,
  string: true,
  date: true,
  time: true,
  async: true,
  file: true,
  encrypt: true,
  general: true,
  uncategorized: true
};
exports.general = exports.file = exports.encrypt = exports.default = exports.date = exports.async = exports.array = void 0;
exports.loadAllModules = loadAllModules;
exports.loadModule = loadModule;
exports.uncategorized = exports.time = exports.string = void 0;
var array = _interopRequireWildcard(require("./array/index.js"));
exports.array = array;
var string = _interopRequireWildcard(require("./string/index.js"));
exports.string = string;
var date = _interopRequireWildcard(require("./date/index.js"));
exports.date = date;
exports.time = date;
var async = _interopRequireWildcard(require("./async/index.js"));
exports.async = async;
Object.keys(async).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === async[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return async[key];
    }
  });
});
var file = _interopRequireWildcard(require("./file/index.js"));
exports.file = file;
Object.keys(file).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === file[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return file[key];
    }
  });
});
var encrypt = _interopRequireWildcard(require("./encrypt/index.js"));
exports.encrypt = encrypt;
Object.keys(encrypt).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === encrypt[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return encrypt[key];
    }
  });
});
var general = _interopRequireWildcard(require("./general/index.js"));
exports.general = general;
Object.keys(general).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === general[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return general[key];
    }
  });
});
var uncategorized = _interopRequireWildcard(require("./uncategorized/index.js"));
exports.uncategorized = uncategorized;
Object.keys(uncategorized).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === uncategorized[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return uncategorized[key];
    }
  });
});
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; } /*
 * @author https://github.com/hhhanzzz
 * @date 2024/12/13
 * @last modified time: 2024/12/23
 */
// 将所有函数整合到一个对象
const hhhanUtils = {
  // ...array,
  // ...string,
  // ...date,
  ...async,
  ...file,
  ...encrypt,
  ...general,
  ...uncategorized,
  loadModule,
  loadAllModules
};

// 提供模块路径映射
const moduleMap = {
  array: () => Promise.resolve().then(() => _interopRequireWildcard(require('./array/index.js'))),
  string: () => Promise.resolve().then(() => _interopRequireWildcard(require('./string/index.js'))),
  date: () => Promise.resolve().then(() => _interopRequireWildcard(require('./date/index.js'))),
  async: () => Promise.resolve().then(() => _interopRequireWildcard(require('./async/index.js'))),
  file: () => Promise.resolve().then(() => _interopRequireWildcard(require('./file/index.js'))),
  encrypt: () => Promise.resolve().then(() => _interopRequireWildcard(require('./encrypt/index.js'))),
  general: () => Promise.resolve().then(() => _interopRequireWildcard(require('./general/index.js'))),
  uncategorized: () => Promise.resolve().then(() => _interopRequireWildcard(require('./uncategorized/index.js')))
};

// 动态加载某个子模块
async function loadModule(moduleName) {
  if (!moduleMap[moduleName]) {
    throw new Error(`Module "${moduleName}" not found.`);
  }
  const module = await moduleMap[moduleName]();
  return module;
}

// 动态加载所有模块
async function loadAllModules() {
  const modules = {};
  for (const [key, loader] of Object.entries(moduleMap)) {
    modules[key] = await loader();
  }
  return modules;
}

// 导出所有函数（便于按需导入）
// export * from './array/index.js'
// export * from './string/index.js'
// export * from './date/index.js'

// 统一导出（便于分类导入）
// 默认导出（便于导入整个工具库）
var _default = exports.default = hhhanUtils;