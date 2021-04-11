import path from 'path'
import fs from 'fs'
import { defineConfig, UserConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
// @ts-ignore
import lessToJS from 'less-vars-to-js'
import { mergeDeepRight } from 'ramda'

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/styles/theme.less'), 'utf8')
)
const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: themeVariables,
        javascriptEnabled: true,
        additionalData: `@import 'src/styles/theme.less';`,
      },
    },
  },
  plugins: [reactRefresh()],
}

const developmentConfig: UserConfig = {
  define: {
    baseURL: `'/'`,
    oauth2GithubClientId: `'92d822348018daa85584'`,
  },
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:6666/api',
        changeOrigin: true,
      },
    },
  },
}

const productionConfig: UserConfig = {
  define: {
    baseURL: `'/api'`,
    oauth2GithubClientId: `'92d822348018daa85584'`,
  },
}

export default defineConfig(({ mode }) => {
  return mergeDeepRight(
    baseConfig,
    mode === 'development' ? developmentConfig : productionConfig
  ) as UserConfig
})
