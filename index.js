/* 
 * @author https://github.com/hhhanzzz
 * @update 2024/12/13
 * @last modified time: 2024/12/13
*/


module.exports = {
  ts,
  toObj,
  toStr,
  queryStr,
  randomNum,
  randomPattern,
  randomString,
  time,
  wait,
}

function ts(type = 13) {
  let date = new Date()
  let res = ''
  switch (type) {
    case 10:
      res = Math.round(date.getTime() / 1000)
      break
    case 13:
      res = Math.round(date.getTime())
      break
    case 'y':
      res = date.getFullYear()
      break
    case 'M':
      res = date.getMonth() + 1
      break
    case 'd':
      res = date.getDate()
      break
    case 'h':
      res = date.getHours()
      break
    case 'm':
      res = date.getMinutes()
      break
    default:
      res = '未知错误, 请检查'
      break
  }
  return res
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
  let qs = ''
  for (const key in opts) {
    let value = opts[key]
    if (value != null) {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      qs += `${key}=${value}&`
    }
  }
  qs = qs.substring(0, qs.length - 1)
  return qs
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

function time(fmt, ts = null) {
  const date = ts ? new Date(ts) : new Date()
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}