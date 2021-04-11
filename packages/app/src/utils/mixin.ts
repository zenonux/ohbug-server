import UA from 'ua-parser-js'
import type { OhbugEvent } from '@ohbug/types'

export function getDeviceInfo(event?: OhbugEvent<any>) {
  if (event) {
    const { device, sdk } = event
    if (device && sdk.platform === 'ohbug-browser') {
      const { url, title, version, language, platform, userAgent } = device

      if (userAgent) {
        const parser = new UA()
        parser.setUA(userAgent)
        const result = parser.getResult()
        const { browser, device, engine, os } = result
        return {
          url,
          title,
          version,
          language,
          platform,
          browser,
          engine,
          os,
          device,
          sdk,
        }
      }
    }

    if (device && sdk.platform === 'ohbug-miniapp') {
      const {
        app,
        version,
        platform,
        device,
        system,
        SDKVersion,
      } = event.device
      return {
        app,
        version,
        platform,
        device,
        system,
        SDKVersion,
        sdk,
      }
    }
  }

  return null
}

export const isAdmin = (admin_id: any, user_id: any) =>
  Number(admin_id) === Number(user_id)
