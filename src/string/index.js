// src/string/index.js

// 首字母大写
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// 转换为小驼峰命名法
function camelCase(str) {
  return str
    .replace(/_./g, (match) => match.charAt(1).toUpperCase())
    .replace(/^./, (match) => match.toLowerCase())
}

// 转换为蛇形命名法
function snakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

// 转换为短横线命名法
function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// 截取字符串并在末尾添加省略号，限制最大字符数
function truncate(str, length = 100, ending = '...') {
  if (str.length > length) {
    return str.slice(0, length) + ending
  }
  return str
}

// 反转字符串
function reverse(str) {
  return str.split('').reverse().join('')
}

// 在字符串左侧填充指定字符直到达到指定长度
function padLeft(str, length, char = ' ') {
  return str.padStart(length, char)
}

// 在字符串右侧填充指定字符直到达到指定长度
function padRight(str, length, char = ' ') {
  return str.padEnd(length, char)
}

// 用指定的字符串替换所有匹配的子字符串
function replaceAll(str, search, replace) {
  return str.split(search).join(replace)
}

// 将字符串中的 HTML 特殊字符转义为对应的 HTML 实体
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, (char) => map[char])
}

// 将 HTML 实体转换回原始字符
function unescapeHtml(str) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => map[match])
}

// 判断字符串是否是回文（即正读和反读都相同）
function isPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return cleaned === cleaned.split('').reverse().join('')
}

// 统计字符串中某个子字符串出现的次数
function countOccurrences(str, subStr) {
  return (str.match(new RegExp(subStr, 'g')) || []).length
}

// 将字符串转换为适用于 URL 的格式，通常为小写字母和短横线连接
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
    .trim()
    .replace(/\s+/g, '-') // 用短横线替换空格
    .replace(/-+/g, '-') // 合并多个短横线
}

export {
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  truncate,
  reverse,
  padLeft,
  padRight,
  replaceAll,
  escapeHtml,
  unescapeHtml,
  isPalindrome,
  countOccurrences,
  slugify,
}
