"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryStr = queryStr;
exports.randomNum = randomNum;
exports.randomPattern = randomPattern;
exports.randomString = randomString;
exports.time = time;
exports.toObj = toObj;
exports.toStr = toStr;
exports.ts = ts;
exports.sleep = exports.wait = wait;
// src/general/index.js

function ts(type = 13) {
  let date = new Date();
  let res = '';
  switch (type) {
    case 10:
      res = Math.round(date.getTime() / 1000);
      break;
    case 13:
      res = Math.round(date.getTime());
      break;
    case 'y':
      res = date.getFullYear();
      break;
    case 'M':
      res = date.getMonth() + 1;
      break;
    case 'd':
      res = date.getDate();
      break;
    case 'h':
      res = date.getHours();
      break;
    case 'm':
      res = date.getMinutes();
      break;
    default:
      res = '未知错误, 请检查';
      break;
  }
  return res;
}
function time(fmt, ts = Date.now()) {
  const date = new Date(ts);
  const map = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.ceil((date.getMonth() + 1) / 3),
    // 季度
    S: date.getMilliseconds()
  };
  return Object.entries(map).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`(${key})`), match => match.length === 1 ? value : value.toString().padStart(match.length, '0'));
  }, fmt);
}
function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function toObj(str, defaultValue = str) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}
function toStr(obj, defaultValue = obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return defaultValue;
  }
}
function queryStr(opts) {
  let qs = '';
  for (const key in opts) {
    let value = opts[key];
    if (value != null) {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      qs += `${key}=${value}&`;
    }
  }
  qs = qs.substring(0, qs.length - 1);
  return qs;
}
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomPattern(pattern, charset = 'abcdef0123456789') {
  let str = '';
  for (let chars of pattern) {
    if (chars == 'x') {
      str += charset.charAt(Math.floor(Math.random() * charset.length));
    } else if (chars == 'X') {
      str += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase();
    } else {
      str += chars;
    }
  }
  return str;
}
function randomString(len, charset = 'abcdef0123456789') {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return str;
}