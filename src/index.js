/*
 * @author https://github.com/hhhanzzz
 * @date 2024/12/13
 * @last modified time: 2025/1/15
 */

import * as async from './async/index.js'
import * as file from './file/index.js'
import * as crypto from './crypto/index.js'
import * as general from './general/index.js'

// 将所有函数整合到一个对象
const hhhanUtils = {
  ...async,
  ...file,
  ...crypto,
  ...general,
  loadModule,
  loadAllModules
}

// 提供模块路径映射
const moduleMap = {
  async: () => import('./async/index.js'),
  file: () => import('./file/index.js'),
  crypto: () => import('./crypto/index.js'),
  general: () => import('./general/index.js'),
}

// 动态加载某个子模块
export async function loadModule(moduleName) {
  if (!moduleMap[moduleName]) {
    throw new Error(`Module "${moduleName}" not found.`)
  }
  const module = await moduleMap[moduleName]()
  return module
}

// 动态加载所有模块
export async function loadAllModules() {
  const modules = {}
  for (const [key, loader] of Object.entries(moduleMap)) {
    modules[key] = await loader()
  }
  return modules
}

export * from './async/index.js'
export * from './file/index.js'
export * from './crypto/index.js'
export * from './general/index.js'

// 统一导出（便于分类导入）
export {
  async,
  file,
  crypto,
  general,
}

// 默认导出（便于导入整个工具库）
export default hhhanUtils
