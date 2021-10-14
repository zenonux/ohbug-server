const path = require('path')
require('dotenv').config({
  path: path.resolve(process.cwd(), `./.env.${process.env.NODE_ENV}`),
})

module.exports = {
  /**
   * 数据库相关配置
   * Database related configuration
   */
  database: {
    /**
     * 使用 typeorm 操作数据库。建议使用 postgresql https://typeorm.io
     * Use typeorm to manipulate the database. It is recommended to use postgresql
     */
    orm: {
      type: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      cache: {
        duration: 30000, // 30 seconds
      },
      logging: process.env.NODE_ENV !== 'production',
    },
    /**
     * redis
     */
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    },
  },
  /**
   * 外置服务相关配置
   * External service related configuration
   */
  service: {
    /**
     * 邮箱相关配置
     * Email related configuration
     */
    email: {
      host: process.env.EMAIL_NOTICE_HOST,
      port: parseInt(process.env.EMAIL_NOTICE_PORT, 10),
      secure: !!parseInt(process.env.EMAIL_NOTICE_SECURE, 10),
      auth: {
        user: process.env.EMAIL_NOTICE_AUTH_USER,
        pass: process.env.EMAIL_NOTICE_AUTH_PASS,
      },
    },
    /**
     * webpush 相关配置
     * webpush related configuration
     */
    webpush: {
      publicKey: process.env.WEBPUSH_PUBLIC_KEY,
      privateKey: process.env.WEBPUSH_PRIVATE_KEY,
    },
  },
  /**
   * 业务相关配置
   * Business related configuration
   */
  business: {
    /**
     * 加密用到的 secret
     * Secret used for encryption
     */
    appSecret: process.env.APP_SECRET,
    /**
     * 管理员账号
     * Admin
     */
    admin: {
      name: process.env.ADMIN_NAME,
      password: process.env.ADMIN_PASSWORD,
    },
    /**
     * sourceMap 文件上传后储存的位置
     */
    uploadSourcemapFilePath: process.env.UPLOAD_SOURCEMAP_FILE_PATH,
    /**
     * 数据过期时间
     * Data expiration time
     */
    expiredData: {
      interval: process.env.TIME_INTERVAL_FOR_CLEANING_UP_EXPIRED_DATA || 30,
    },
    sourceMap: {
      /**
       * 可允许储存的 sourceMap 的最大数量
       * The maximum number of sourceMaps that can be stored
       */
      max: 10,
    },
  },
}
