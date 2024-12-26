/*
 * @author https://github.com/hhhanzzz
 * @date 2024/12/13
 * @last modified time: 2024/12/23
 */

import * as array from './array/index.js'
import * as string from './string/index.js'
import * as date from './date/index.js'
import * as async from './async/index.js'
import * as file from './file/index.js'
import * as encrypt from './encrypt/index.js'
import * as general from './general/index.js'
import * as uncategorized from './uncategorized/index.js'

// 将所有函数整合到一个对象
const hhhanUtils = {
  // ...array,
  // ...string,
  // ...date,
  ...async,
  ...file,
  ...encrypt,
  ...general,
  ...uncategorized,
  loadModule,
  loadAllModules
}

// 提供模块路径映射
const moduleMap = {
  array: () => import('./array/index.js'),
  string: () => import('./string/index.js'),
  date: () => import('./date/index.js'),
  async: () => import('./async/index.js'),
  file: () => import('./file/index.js'),
  encrypt: () => import('./encrypt/index.js'),
  general: () => import('./general/index.js'),
  uncategorized: () => import('./uncategorized/index.js'),
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

// 导出所有函数（便于按需导入）
// export * from './array/index.js'
// export * from './string/index.js'
// export * from './date/index.js'
export * from './async/index.js'
export * from './file/index.js'
export * from './encrypt/index.js'
export * from './general/index.js'
export * from './uncategorized/index.js'

// 统一导出（便于分类导入）
export {
  array,
  string,
  date,
  date as time,
  async,
  file,
  encrypt,
  general,
  uncategorized,
}

// 默认导出（便于导入整个工具库）
export default hhhanUtils
