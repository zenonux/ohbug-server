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
    // class 方法内必须使用 this
    'class-methods-use-this': 'off',
    // 若一个文件内只有一个导出 使用 export default
    'import/prefer-default-export': 'off',
    // function 中必须 return
    'consistent-return': 'off',
    // 单文件最大 class 数量限制
    'max-classes-per-file': 'off',
    // react jsx 不允许使用 spreading
    'react/jsx-props-no-spreading': 'off',
    // for of 限制
    'no-restricted-syntax': 'off',
  },
}
