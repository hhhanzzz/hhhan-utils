"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  limitConcurrency: true
};
exports.limitConcurrency = limitConcurrency;
var _http = require("./http.js");
Object.keys(_http).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _http[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _http[key];
    }
  });
});
// src/async/index.js

/**
 * 并发限制器
 * @param {Array<Function>} tasks 异步任务列表
 * @param {number} limit 并发限制
 * @returns {Promise<any[]>} 执行结果
 */
async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const promise = task().then(res => {
      results.push(res);
      executing.splice(executing.indexOf(promise), 1);
    });
    executing.push(promise);
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}