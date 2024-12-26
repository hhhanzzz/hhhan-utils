"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk = chunk;
exports.deepEqual = deepEqual;
exports.difference = difference;
exports.flatten = flatten;
exports.groupBy = groupBy;
exports.intersect = intersect;
exports.pluck = pluck;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.union = union;
exports.unique = unique;
exports.zip = zip;
// src/array/index.js

// 数组去重
function unique(arr) {
  return [...new Set(arr)];
}

// 数组合并去重
function union(...arrays) {
  return [...new Set([].concat(...arrays))];
}

// 数组分块
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// 数组扁平化
function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

// 数组交集
function intersect(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

// 数组差集
function difference(arr1, arr2) {
  return arr1.filter(value => !arr2.includes(value));
}

// 数组随机打乱
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换元素
  }
  return arr;
}

// 按条件分组
function groupBy(arr, fn) {
  return arr.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});
}

// 获取数组中所有对象的某一属性值
function pluck(arr, key) {
  return arr.map(item => item[key]);
}

// 合并多个数组
function zip(...arrays) {
  const length = Math.max(...arrays.map(arr => arr.length));
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(arrays.map(arr => arr[i]));
  }
  return result;
}

// 数组旋转
function rotate(arr, times) {
  times = times % arr.length;
  return arr.slice(times).concat(arr.slice(0, times));
}

// 深度比较数组
function deepEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}