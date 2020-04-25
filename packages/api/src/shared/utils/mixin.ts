import * as UA from 'ua-device';
import type { OhbugTags } from '@ohbug/types';

export function getTagsInfoByTags(tags: OhbugTags) {
  const { uuid, url, title, version, language, platform, userAgent } = tags;
  const { browser, engine, os, device } = new UA(userAgent);
  return {
    uuid,
    url,
    title,
    version,
    language,
    platform,
    browser: browser?.name,
    browser_version: browser?.version?.original,
    engine: engine?.name,
    engine_version: engine?.version?.original,
    os: os?.name,
    os_version: os?.version?.original,
    device: device?.model,
    device_type: device?.type,
    device_manufacturer: device?.manufacturer,
  };
}
