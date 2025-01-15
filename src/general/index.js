// src/general/index.js

function ts(type = 13) {
  const date = new Date()
  switch (type) {
    case 10:
      return Math.round(date.getTime() / 1000)
    case 13:
      return Math.round(date.getTime())
    case 'y':
      return date.getFullYear()
    case 'M':
      return date.getMonth() + 1
    case 'd':
      return date.getDate()
    case 'h':
      return date.getHours()
    case 'm':
      return date.getMinutes()
    default:
      return '类型错误, 请检查'
  }
}

function time(fmt, ts = Date.now()) {
  const date = new Date(ts)
  const map = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.ceil((date.getMonth() + 1) / 3), // 季度
    S: date.getMilliseconds(),
  }

  return Object.entries(map).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`(${key})`), (match) =>
      match.length === 1 ? value : value.toString().padStart(match.length, '0')
    )
  }, fmt)
}

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function toObj(str, defaultValue = str) {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

function toStr(obj, defaultValue = obj) {
  try {
    return JSON.stringify(obj)
  } catch {
    return defaultValue
  }
}

function queryStr(opts) {
  return Object.entries(opts)
    .filter(([key, value]) => value != null) // 过滤掉值为 null 或 undefined 的项
    .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('&')
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomPattern(pattern, charset = 'abcdef0123456789') {
  let str = ''
  for (let chars of pattern) {
    if (chars == 'x') {
      str += charset.charAt(Math.floor(Math.random() * charset.length))
    } else if (chars == 'X') {
      str += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase()
    } else {
      str += chars
    }
  }
  return str
}

function randomString(len, charset = 'abcdef0123456789') {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return str
}

export * from './unclassified.js'

export {
  time,
  ts,
  wait,
  wait as sleep,
  toObj,
  toStr,
  queryStr,
  randomNum,
  randomPattern,
  randomString,
}