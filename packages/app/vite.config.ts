import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginImp from 'vite-plugin-imp'
import { mergeDeepRight } from 'ramda'

const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        css: true,
        modifyVars: {
          hack: `true; @import "${path.resolve(
            __dirname,
            'src/styles/theme.less'
          )}";`,
        },
        javascriptEnabled: true,
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
