import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginImp from 'vite-plugin-imp'
// @ts-ignore
import lessToJS from 'less-vars-to-js'

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/styles/theme.less'), 'utf8')
)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let define = {}
  if (mode === 'development') {
    define = {
      baseURL: `'/'`,
      oauth2GithubClientId: `'92d822348018daa85584'`,
    }
  }
  if (mode === 'production') {
    define = {
      baseURL: `'/api'`,
      oauth2GithubClientId: `'92d822348018daa85584'`,
    }
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@@': path.resolve(__dirname, 'src/.neoi'),
      },
    },
    define,
    server: {
      proxy: {
        '/v1': {
          target: 'http://localhost:6666/api',
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: themeVariables,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      reactRefresh(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style/index.js`,
          },
        ],
      }),
    ],
  }
})
