import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CryptoJS from 'crypto-js';
import { publicEncrypt, createSign } from 'crypto';

// src/async/http.js

const DEFAULT_TIMEOUT = 5000, DEFAULT_RETRY = 5;

// 处理超时的 fetch 请求
function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TimeoutError')), timeout)
  );
  return Promise.race([fetch(url, options), timeoutPromise])
}

// 请求函数，带有重试机制
async function request(opts = {}) {
  // 如果 opts 不是对象，假设它是 URL 或 fn
  if (typeof opts !== 'object') {
    opts = { url: opts };  // 如果是字符串，则默认为 url
  }

  const { fn = opts.url, url, method = 'GET', retryNum = opts.retryNum || DEFAULT_RETRY } = opts;
  let resp = null;

  const fetchOptions = {
    method: method.toUpperCase(),
    headers: opts.headers || {},
    body: opts.body || null,
  };

  for (let count = 1; count <= retryNum; count++) {
    try {
      // 调用 fetch 请求，并设置超时
      resp = await fetchWithTimeout(url, fetchOptions, DEFAULT_TIMEOUT);
      break
    } catch (err) {
      resp = err.resp || {};
      const errcodes = ['ECONNRESET', 'EADDRINUSE', 'ENOTFOUND', 'EAI_AGAIN'];
      const isTimeoutError = err.message === 'TimeoutError';

      if (isTimeoutError) {
        console.log(`[${fn}]请求超时，重试第${count}次`);
      } else if (errcodes.includes(err.code)) {
        console.log(`[${fn}]请求错误(${err.code})，重试第${count}次`);
      } else {
        console.log(`[${fn}]请求错误(${err.message})`);
        break
      }

      // 若是最后一次尝试则抛出错误
      if (count === retryNum) {
        console.log(`[${fn}]已达最大重试次数，放弃请求`);
      }
    }
  }

  if(resp && resp.text) resp.responseBody  = await resp.text();
  const { status = -1, headers = null } = resp || {};
  return { statusCode: status, headers, body: parseBody(resp.responseBody) }
}

// 简单的 JSON 解析，防止 JSON 解析错误
function parseBody(body) {
  try {
    return body ? JSON.parse(body) : null
  } catch {
    return body
  }
}

// 封装 http 请求函数
async function http(opts = {}) {
  try {
    const { body } = await request(opts);
    return body
  } catch (e) {
    console.log(e);
  }
}

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
    const promise = task().then((res) => {
      results.push(res);
      executing.splice(executing.indexOf(promise), 1);
    });
    executing.push(promise);
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results
}

var async = /*#__PURE__*/Object.freeze({
  __proto__: null,
  http: http,
  limitConcurrency: limitConcurrency,
  request: request
});

// src/file/index.js


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readFileUpwards(file, startDir = __dirname, maxLevels = 3) {
  try {
    if (!file) return

    let filePath = findFileUpwards(startDir, file, maxLevels, ['node_modules', '.git', 'dist']);
    if (!filePath) return

    let fileContent = fs.readFileSync(filePath, {
      flag: 'r',
      encoding: 'utf-8'
    });

    return fileContent
  } catch (e) {
    console.log(`读取文件失败: ${e}`);
  }
}

/**
 * 从当前目录逐层向上查找指定文件
 * @param {string} startDir - 起始目录
 * @param {string} targetFile - 目标文件名
 * @param {string[]} ignoreDirs - 需要忽略的目录名称
 * @param {number} maxLevels - 最大向上遍历层级
 * @returns {string|null} 找到的文件路径或 null
 */
function findFileUpwards(startDir, targetFile, maxLevels = 3, ignoreDirs = ['node_modules']) {
  let currentDir = startDir;
  let currentLevel = 0;

  while (currentDir && currentLevel <= maxLevels) {
    try {
      // 获取当前目录中的所有文件和文件夹
      console.log(`当前查找目录: ${currentDir}`);
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const itemPath = path.join(currentDir, item);

        try {
          const stat = fs.statSync(itemPath);

          if (stat.isFile() && item === targetFile) {
            return itemPath // 找到目标文件，返回路径
          } else if (stat.isDirectory() && !ignoreDirs.includes(item) && hasReadPermission(itemPath)) {
            // 如果是文件夹、未被忽略且有读取权限，递归遍历其内容
            const result = searchInDirectory(itemPath, targetFile, ignoreDirs);
            if (result) return result
          }
        } catch (err) {
          console.error(`查看${itemPath}失败`, err);
        }
      }
    } catch (err) {
      console.error(`读取目录${currentDir}失败`, err);
    }

    // 获取父目录
    const parentDir = path.dirname(currentDir);

    // 如果已到根目录，停止遍历
    if (parentDir === currentDir) break

    currentDir = parentDir;
    currentLevel++; // 增加层级计数
  }

  return null // 未找到目标文件
}

/**
 * 在一个目录中递归查找目标文件
 * @param {string} dir - 要搜索的目录
 * @param {string} targetFile - 目标文件名
 * @param {string[]} ignoreDirs - 需要忽略的目录名称
 * @returns {string|null} 找到的文件路径或 null
 */
function searchInDirectory(dir, targetFile, ignoreDirs = []) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);

      try {
        const stat = fs.statSync(itemPath);

        if (stat.isFile() && item === targetFile) {
          return itemPath // 找到目标文件，返回路径
        } else if (stat.isDirectory() && !ignoreDirs.includes(item) && hasReadPermission(itemPath)) {
          const result = searchInDirectory(itemPath, targetFile, ignoreDirs); // 递归查找
          if (result) {
            return result
          }
        }
      } catch (err) {
        console.error(`查看${itemPath}失败`, err);
      }
    }
  } catch (err) {
    console.error(`读取目录${dir}失败`, err);
  }

  return null // 未找到目标文件
}

/**
 * 检查用户是否对文件夹有读取权限
 * @param {string} dir - 文件夹路径
 * @returns {boolean} 是否有读取权限
 */
function hasReadPermission(dir) {
  try {
    fs.accessSync(dir, fs.constants.R_OK); // 检查读取权限
    return true
  } catch (err) {
    console.warn(`无读取权限: ${dir}`);
    return false
  }
}

var file = /*#__PURE__*/Object.freeze({
  __proto__: null,
  findFileUpwards: findFileUpwards,
  hasReadPermission: hasReadPermission,
  readFileUpwards: readFileUpwards,
  searchInDirectory: searchInDirectory
});

// src/encrypt/index.js


function MD5(data, type = 0) {
  switch (type) {
    case 0:
      data = CryptoJS.MD5(data).toString().toLowerCase();
      break
    case 1:
      data = CryptoJS.MD5(data).toString().toUpperCase();
      break
    case 2:
      data = CryptoJS.MD5(data).toString().substring(8, 24).toLowerCase();
      break
    case 3:
      data = CryptoJS.MD5(data).toString().substring(8, 24).toUpperCase();
      break
  }
  return data
}

function SHA(method, data, type = 0) {
  const hash = CryptoJS[method](data);
  return type === 0 ? hash.toString() : hash.toString(CryptoJS.enc.Base64)
}

function HmacSHA(method, data, key, type = 0) {
  const hash = CryptoJS[method](data, key);
  return type === 0 ? hash.toString() : hash.toString(CryptoJS.enc.Base64)
}

// 0 表示编码，1 表示解码
function Base64(type, data) {
  return type === 0
    ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
    : CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data))
}

function CryptoTransform(type, method, mode, padding, data, key, iv) {
  const options = {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode[mode],
    padding: CryptoJS.pad[padding],
  };

  switch (type) {
    case 0:
      const encrypted = CryptoJS[method].encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.Utf8.parse(key), options);
      return encrypted.toString()
    case 1:
      const decrypted = CryptoJS[method].decrypt(data, CryptoJS.enc.Utf8.parse(key), options);
      return decrypted.toString(CryptoJS.enc.Utf8)
    case 'base64':
      const ciphertext = CryptoJS[method].encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.Utf8.parse(key), options).ciphertext;
      return CryptoJS.enc.Base64.stringify(ciphertext)
  }
}

/**
 * 使用 RSA 公钥加密数据
 * @param {string} data - 需要加密的数据
 * @param {string} publicKey - RSA 公钥
 * @returns {string} 加密后的 Base64 字符串
 */
function RSA(data, publicKey) {
  const bufferData = Buffer.from(data, 'utf8');
  const encrypted = publicEncrypt(
    {
      key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    bufferData
  );

  return encrypted.toString('base64')
}

/**
 * 使用 SHA1withRSA 签名
 * @param {string} data - 需要签名的数据
 * @param {string} privateKey - RSA 私钥字符串
 * @returns {string} Base64 编码的签名结果
 */
function SHA1withRSA(data, privateKey) {
  const sign = createSign('SHA1'); // 创建一个签名对象，使用 SHA1 哈希算法
  sign.update(data); // 将数据传入签名对象
  const signature = sign.sign(privateKey, 'base64'); // 使用 RSA 私钥进行签名，并返回 Base64 编码的签名
  return signature // 返回签名结果
}

function HexToBase64(hex) {
  const bytes = new Uint8Array(
    hex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  );
  return btoa(String.fromCharCode(...bytes))
}

var crypto$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Base64: Base64,
  CryptoTransform: CryptoTransform,
  HexToBase64: HexToBase64,
  HmacSHA: HmacSHA,
  MD5: MD5,
  RSA: RSA,
  SHA: SHA,
  SHA1withRSA: SHA1withRSA
});

// src/general/index.js

function ts(type = 13) {
  const date = new Date();
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
  const date = new Date(ts);
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
  };

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
  return str
}

function randomString(len, charset = 'abcdef0123456789') {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return str
}

var general = /*#__PURE__*/Object.freeze({
  __proto__: null,
  queryStr: queryStr,
  randomNum: randomNum,
  randomPattern: randomPattern,
  randomString: randomString,
  sleep: wait,
  time: time,
  toObj: toObj,
  toStr: toStr,
  ts: ts,
  wait: wait
});

/*
 * @author https://github.com/hhhanzzz
 * @date 2024/12/13
 * @last modified time: 2025/1/15
 */


// 将所有函数整合到一个对象
const hhhanUtils = {
  ...async,
  ...file,
  ...crypto$1,
  ...general,
  loadModule,
  loadAllModules
};

// 提供模块路径映射
const moduleMap = {
  async: () => Promise.resolve().then(function () { return async; }),
  file: () => Promise.resolve().then(function () { return file; }),
  crypto: () => Promise.resolve().then(function () { return crypto$1; }),
  general: () => Promise.resolve().then(function () { return general; }),
};

// 动态加载某个子模块
async function loadModule(moduleName) {
  if (!moduleMap[moduleName]) {
    throw new Error(`Module "${moduleName}" not found.`)
  }
  const module = await moduleMap[moduleName]();
  return module
}

// 动态加载所有模块
async function loadAllModules() {
  const modules = {};
  for (const [key, loader] of Object.entries(moduleMap)) {
    modules[key] = await loader();
  }
  return modules
}

export { Base64, CryptoTransform, HexToBase64, HmacSHA, MD5, RSA, SHA, SHA1withRSA, async, crypto$1 as crypto, hhhanUtils as default, file, findFileUpwards, general, hasReadPermission, http, limitConcurrency, loadAllModules, loadModule, queryStr, randomNum, randomPattern, randomString, readFileUpwards, request, searchInDirectory, wait as sleep, time, toObj, toStr, ts, wait };
//# sourceMappingURL=hhhan-utils.js.map
