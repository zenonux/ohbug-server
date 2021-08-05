import path from 'path'
import fs from 'fs'
import { defineConfig, UserConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginImp from 'vite-plugin-imp'
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
  server: {
    port: 8888,
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
    },
  },
}

const productionConfig: UserConfig = {
  plugins: [
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
}

export default defineConfig(
  ({ mode }) =>
    mergeDeepRight(
      baseConfig,
      mode === 'development' ? developmentConfig : productionConfig
    ) as UserConfig
)
