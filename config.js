const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`),
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
      entities: ['dist/**/*.entity{.ts,.js}'],
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
     * 数据过期时间
     * Data expiration time
     */
    expiredData: {
      interval: process.env.TIME_INTERVAL_FOR_CLEANING_UP_EXPIRED_DATA,
    },
    sourceMap: {
      /**
       * 可允许储存的 sourceMap 的最大数量
       * The maximum number of sourceMaps that can be stored
       */
      max: 10,
    },
  },
  /**
   * 安全相关配置
   * Security related configuration
   */
  security: {
    user: {
      password: {
        /**
         * 用户密码加盐
         * User password salt
         */
        salt: process.env.USER_PASSWORD_SALT,
      },
    },
    oauth: {
      /**
       * github oauth2 登录所需要的参数
       * Parameters required for github oauth2 login
       * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
       */
      github: {
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        callback_url: process.env.OAUTH_GITHUB_CALLBACK_URL,
      },
    },
    /**
     * JWT 所需要的参数
     * JWT required parameters
     */
    jwt: {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    },
  },
}
