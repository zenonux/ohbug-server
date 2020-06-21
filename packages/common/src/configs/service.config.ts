import { registerAs } from '@nestjs/config';

export const serviceConfig = registerAs('service', () => ({
  sms: {
    sending_interval: parseInt(process.env.SMS_SENDING_INTERVAL, 10),
    config: {
      accessKeyId: process.env.SMS_CONFIG_ACCESS_KEY_ID,
      accessKeySecret: process.env.SMS_CONFIG_ACCESS_KEY_SECRET,
      endpoint: process.env.SMS_CONFIG_ENDPOINT,
      apiVersion: process.env.SMS_CONFIG_API_VERSION,
    },
    params: {
      RegionId: process.env.SMS_PARAMS_REGION_ID,
      SignName: process.env.SMS_PARAMS_SIGN_NAME,
      TemplateCode: process.env.SMS_PARAMS_TEMPLATE_CODE,
    },
  },
  oss: {
    config: {
      accessKeyId: process.env.OSS_CONFIG_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_CONFIG_ACCESS_KEY_SECRET,
      endpoint: process.env.OSS_CONFIG_ENDPOINT,
      apiVersion: process.env.OSS_CONFIG_API_VERSION,
    },
    params: {
      RoleArn: process.env.OSS_PARAMS_ARN,
      RoleSessionName: process.env.OSS_PARAMS_SESSION_NAME,
    },
  },
  email: {
    user: process.env.EMAIL_NOTICE_USER,
    pass: process.env.EMAIL_NOTICE_PASS,
  },
  webpush: {
    publicKey: process.env.WEBPUSH_PUBLIC_KEY,
    privateKey: process.env.WEBPUSH_PRIVATE_KEY,
  },
}));
