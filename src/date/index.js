// src/date/index.js


// 计算两个日期的时间差，返回指定单位
function timeDifference(date1, date2, unit = 'ms') {
  const diff = Math.abs(date2 - date1)
  const units = {
    ms: diff,
    s: diff / 1000,
    m: diff / 60000,
    h: diff / 3600000,
    d: diff / 86400000,
  }
  return units[unit] || diff
}

// 判断给定年份是否是闰年
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// 返回某年某月的总天数
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

// 将日期字符串转换为时间戳
function toTimestamp(dateStr) {
  return new Date(dateStr).getTime()
}

// 验证是否为合法日期
function isValidDate(dateStr) {
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

// 返回当前周或月的时间范围
function getWeekOrMonthRange(date = new Date(), type = 'week') {
  const start = new Date(date)
  const end = new Date(date)

  if (type === 'week') {
    const day = start.getDay() || 7
    start.setDate(start.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
  } else if (type === 'month') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(start.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
  }

  return { start, end }
}

// 生成指定范围内的随机日期
function randomDate(start = new Date(2000, 0, 1), end = new Date()) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// 计算相对时间，比如"几分钟前"、"几天前"
function timeAgo(date) {
  const now = Date.now()
  const diff = now - new Date(date).getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds}秒前`
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

export {
  timeDifference,
  isLeapYear,
  daysInMonth,
  toTimestamp,
  isValidDate,
  getWeekOrMonthRange,
  randomDate,
  timeAgo,
}
