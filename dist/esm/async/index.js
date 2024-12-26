// src/async/index.js

export * from './http.js'


/**
 * 并发限制器
 * @param {Array<Function>} tasks 异步任务列表
 * @param {number} limit 并发限制
 * @returns {Promise<any[]>} 执行结果
 */
async function limitConcurrency(tasks, limit) {
  const results = []
  const executing = []
  for (const task of tasks) {
    const promise = task().then((res) => {
      results.push(res)
      executing.splice(executing.indexOf(promise), 1)
    })
    executing.push(promise)
    if (executing.length >= limit) {
      await Promise.race(executing)
    }
  }
  await Promise.all(executing)
  return results
}

export { limitConcurrency }
