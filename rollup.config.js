import path from 'path'
import { fileURLToPath } from 'url'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  input: 'src/index.js', // 入口文件路径，根据你的项目结构修改
  output: [
    {
      file: path.resolve(__dirname, 'dist/cjs/hhhan-utils.cjs'), // 输出文件路径，CommonJS 格式
      format: 'cjs', // 输出格式为 CommonJS
      sourcemap: true, // 是否生成 sourcemap 文件，方便调试
    },
    // {
    //   file: path.resolve(__dirname, 'dist/browser/hhhan-utils.min.js'),
    //   format: 'umd',  // UMD 格式
    //   name: 'hhhanUtils',  // 暴露的全局变量名称
    //   sourcemap: true,
    //   globals: {
    //     // 如果你的项目依赖了某些外部库，可以在这里声明全局变量
    //     // 例如：
    //     'crypto-js': 'CryptoJS',
    //   }
    // },
    {
      file: path.resolve(__dirname, 'dist/esm/hhhan-utils.js'), // 输出文件路径，ES模块格式
      format: 'esm', // 输出格式为 ES 模块
      sourcemap: true, // 是否生成 sourcemap 文件
    },
    {
      file: path.resolve(__dirname, 'dist/hhhan-utils.js'), // 输出文件路径，ES模块格式
      format: 'esm', // 输出格式为 ES 模块
      sourcemap: true, // 是否生成 sourcemap 文件
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true, // 使用 Node.js 的内建模块（如 fs, path 等）
      modulesOnly: true, // 只处理 Node.js 模块（避免打包第三方依赖）
    }),
    commonjs(), // 处理 CommonJS 模块
    // terser(), // 压缩代码（可选）
  ],
  external: ['fs', 'path', 'url'], // 外部依赖，排除打包 Node.js 内建模块
}
