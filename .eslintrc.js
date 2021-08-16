const path = require('path')

module.exports = {
  extends: [require.resolve('@chenyueban/lint/src/eslint')],
  rules: {
    // 导入未安装的依赖
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          __dirname,
          path.join(__dirname, 'packages/app'),
          path.join(__dirname, 'packages/common'),
          path.join(__dirname, 'packages/dashboard'),
          path.join(__dirname, 'packages/manager'),
          path.join(__dirname, 'packages/notifier'),
          path.join(__dirname, 'packages/transfer'),
        ],
      },
    ],
    'import/extensions': 'off',
  },
}
