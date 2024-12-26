// src/async/http.js

import got from 'got'

const DEFAULT_TIMEOUT = 8000, DEFAULT_RETRY = 5

// 预定义 got 实例
const customGot = got.extend({
  retry: { limit: 0 }, // 不进行重试，手动控制重试逻辑
  timeout: {
    request: DEFAULT_TIMEOUT,
  },
  followRedirect: false,
})


// 请求函数，带有重试机制
async function request(opts = {}) {
  // 如果 opts 不是对象，假设它是 URL 或 fn
  if (typeof opts !== 'object') {
    opts = {
      url: opts, // 如果是字符串，则默认为 url
      method: 'GET', // 默认为 GET 请求
    }
  }

  const { fn = opts.url, method = 'GET', retryNum = DEFAULT_RETRY, ...restOpts } = opts
  let resp = null

  for (let count = 1; count <= retryNum; count++) {
    try {
      // 调用 got 请求
      resp = await customGot({ method: method.toUpperCase(), ...restOpts })

      // 成功返回响应
      return {
        statusCode: resp.statusCode,
        headers: resp.headers,
        body: parseBody(resp.body),
      }
    } catch (err) {
      const errcodes = ['ECONNRESET', 'EADDRINUSE', 'ENOTFOUND', 'EAI_AGAIN']
      const isTimeoutError = err.name === 'TimeoutError'

      if (isTimeoutError) {
        console.log(`[${fn}]请求超时(${err.code})，重试第${count}次`)
      } else if (errcodes.includes(err.code)) {
        console.log(`[${fn}]请求错误(${err.code})，重试第${count}次`)
      } else {
        // 对其他错误进行处理
        const statusCode = err.response ? err.response.statusCode : -1
        console.log(`[${fn}]请求错误(${err.message}), 返回[${statusCode}]`)
        break
      }

      // 若是最后一次尝试则抛出错误
      if (count === retryNum) {
        console.log(`[${fn}]已达最大重试次数，放弃请求`)
      }
    }
  }

  // 请求失败时返回默认结构
  return { statusCode: -1, headers: null, body: null }
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
    const { body } = await request(opts)
    return body
  } catch (e) {
    console.log(e)
  }
}

export {
  request,
  http
}