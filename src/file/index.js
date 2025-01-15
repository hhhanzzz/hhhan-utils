// src/file/index.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function readFileUpwards(file, startDir = __dirname, maxLevels = 3) {
  try {
    if (!file) return

    let filePath = findFileUpwards(startDir, file, maxLevels, ['node_modules', '.git', 'dist'])
    if (!filePath) return

    let fileContent = fs.readFileSync(filePath, {
      flag: 'r',
      encoding: 'utf-8'
    })

    return fileContent
  } catch (e) {
    console.log(`读取文件失败: ${e}`)
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
  let currentDir = startDir
  let currentLevel = 0

  while (currentDir && currentLevel <= maxLevels) {
    try {
      // 获取当前目录中的所有文件和文件夹
      console.log(`当前查找目录: ${currentDir}`)
      const items = fs.readdirSync(currentDir)

      for (const item of items) {
        const itemPath = path.join(currentDir, item)

        try {
          const stat = fs.statSync(itemPath)

          if (stat.isFile() && item === targetFile) {
            return itemPath // 找到目标文件，返回路径
          } else if (stat.isDirectory() && !ignoreDirs.includes(item) && hasReadPermission(itemPath)) {
            // 如果是文件夹、未被忽略且有读取权限，递归遍历其内容
            const result = searchInDirectory(itemPath, targetFile, ignoreDirs)
            if (result) return result
          }
        } catch (err) {
          console.error(`查看${itemPath}失败`, err)
        }
      }
    } catch (err) {
      console.error(`读取目录${currentDir}失败`, err)
    }

    // 获取父目录
    const parentDir = path.dirname(currentDir)

    // 如果已到根目录，停止遍历
    if (parentDir === currentDir) break

    currentDir = parentDir
    currentLevel++ // 增加层级计数
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
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const itemPath = path.join(dir, item)

      try {
        const stat = fs.statSync(itemPath)

        if (stat.isFile() && item === targetFile) {
          return itemPath // 找到目标文件，返回路径
        } else if (stat.isDirectory() && !ignoreDirs.includes(item) && hasReadPermission(itemPath)) {
          const result = searchInDirectory(itemPath, targetFile, ignoreDirs) // 递归查找
          if (result) {
            return result
          }
        }
      } catch (err) {
        console.error(`查看${itemPath}失败`, err)
      }
    }
  } catch (err) {
    console.error(`读取目录${dir}失败`, err)
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
    fs.accessSync(dir, fs.constants.R_OK) // 检查读取权限
    return true
  } catch (err) {
    console.warn(`无读取权限: ${dir}`)
    return false
  }
}


export {
  readFileUpwards,
  findFileUpwards,
  searchInDirectory,
  hasReadPermission,
}