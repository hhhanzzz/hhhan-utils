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

function normalizeTs(ts, opts = {}) {
  const ts_len = opts.len || 13
  ts = ts.toString()
  return parseInt(ts.padEnd(ts_len, '0').slice(0, ts_len))
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

function log(...logs) {
  if (logs.length <= 0) return
  let logPrefix = ''
  let opts = { console: true }
  if (logs.length > 1 && logs.at(-1) instanceof Object) Object.assign(opts, logs.pop())

  if (!opts.timeless && opts.time) {
    let fmt = opts.fmt || 'HH:mm:ss'
    logPrefix = `[${time(fmt)}]`
  }

  if (!opts.prefixless && opts.prefix) {
    if (opts.logPrefix) {
      logPrefix += opts.logPrefix
    }
  }

  if (opts.error && logs[0] instanceof Error) {
    const err = logs.shift()
    logs.unshift(err.message)
  }

  logs = logs.map(log => {
    if (typeof log !== 'string') log = toStr(log)
    return log ? (log.startsWith('\n') ? `\n${logPrefix}${log.substring(1)}` : `${logPrefix}${log}`) : log
  })
  if (opts.console) console.log(logs.join('\n'))
}

async function waitUntil(date, opts = {}) {
  const { interval = 1000, limit = 3600000, ahead = 0 } = opts

  // 判断 date 是否为有效的时间格式
  if (typeof date === 'string') {
    if (!date.includes(':')) {
      return log(`无效的时间格式: ${date}, 预期格式为 'HH:mm:ss' 或 'yyyy-MM-dd HH:mm:ss'`)
    }
    if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(date)) {
      return log(`无效的时间格式: ${date}, 预期格式为 hh:mm:ss`)
    }
    if (date.includes('-')) {
      date = new Date(date).getTime()
    } else {
      date = new Date(time('yyyy-MM-dd ') + date).getTime()
    }
  }

  // 如果 date 不是数字（即不是时间戳），不等待
  if (typeof date !== 'number') {
    return log(`时间参数无效: ${date}, 预期为时间戳或有效的时间字符串`)
  }

  let targetTs = normalizeTs(date) - ahead
  let targetTime = time('hh:mm:ss.S', targetTs)
  let currentTs = Date.now()

  if (currentTs > targetTs) targetTs += 86400000 // 24小时内

  let waitTs = targetTs - currentTs
  if (waitTs > limit) {
    return log(`离目标时间[${targetTime}]大于${limit / 1000}秒, 不等待`, { time: true, fmt: opts.fmt || 'HH:mm:ss.S' })
  }
  log(`离目标时间[${targetTime}]还有${waitTs / 1000}秒, 开始等待`, { time: true, fmt: opts.fmt || 'HH:mm:ss.S' })

  // 等待目标时间
  while (waitTs > 0) {
    const minTime = Math.min(waitTs, interval)
    await wait(minTime)
    waitTs = targetTs - Date.now()
  }
  log('已完成等待', { time: true, fmt: opts.fmt || 'HH:mm:ss.S' })
}

async function waitGap(ts, interval) {
  const gapTs = Date.now() - ts
  gapTs < interval && (await wait(interval - gapTs))
}

export * from './unclassified.js'

export {
  ts,
  normalizeTs,
  time,
  wait,
  wait as sleep,
  toObj,
  toStr,
  queryStr,
  randomNum,
  randomPattern,
  randomString,
  log,
  waitUntil,
  waitGap
}