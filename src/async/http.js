// src/async/http.js

const DEFAULT_TIMEOUT = 5000, DEFAULT_RETRY = 5

// 处理超时的 fetch 请求
function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TimeoutError')), timeout)
  )
  return Promise.race([fetch(url, options), timeoutPromise])
}

// 请求函数，带有重试机制
async function request(opts = {}) {
  // 如果 opts 不是对象，假设它是 URL 或 fn
  if (typeof opts !== 'object') {
    opts = { url: opts }  // 如果是字符串，则默认为 url
  }

  const { fn = opts.url, url, method = 'GET', retryNum = opts.retryNum || DEFAULT_RETRY } = opts
  let resp = null

  const fetchOptions = {
    method: method.toUpperCase(),
    headers: opts.headers || {},
    body: opts.body || null,
  }

  for (let count = 1; count <= retryNum; count++) {
    try {
      // 调用 fetch 请求，并设置超时
      resp = await fetchWithTimeout(url, fetchOptions, DEFAULT_TIMEOUT)
      break
    } catch (err) {
      resp = err.resp || {}
      const errcodes = ['ECONNRESET', 'EADDRINUSE', 'ENOTFOUND', 'EAI_AGAIN']
      const isTimeoutError = err.message === 'TimeoutError'

      if (isTimeoutError) {
        console.log(`[${fn}]请求超时，重试第${count}次`)
      } else if (errcodes.includes(err.code)) {
        console.log(`[${fn}]请求错误(${err.code})，重试第${count}次`)
      } else {
        console.log(`[${fn}]请求错误(${err.message})`)
        break
      }

      // 若是最后一次尝试则抛出错误
      if (count === retryNum) {
        console.log(`[${fn}]已达最大重试次数，放弃请求`)
      }
    }
  }

  if(resp && resp.text) resp.responseBody  = await resp.text()
  const { status = -1, headers = null } = resp || {}
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