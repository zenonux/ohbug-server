type Type = 'JavaScript' | 'NodeJS' | string
function getPlatformLogo(type: Type): string {
  switch (type) {
    case 'JavaScript':
      return require('@/static/images/JavaScript.jpg')
    case 'NodeJS':
      return require('@/static/images/NodeJS.jpg')
    default:
      return require('@/static/images/JavaScript.jpg')
  }
}

export default getPlatformLogo
