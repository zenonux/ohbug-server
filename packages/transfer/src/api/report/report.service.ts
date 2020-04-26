import { Injectable, ForbiddenException } from '@nestjs/common';
import type { OhbugEvent } from '@ohbug/types';

@Injectable()
export class ReportService {
  /**
   * 对 event 进行格式化
   *
   * @param json 通过上报接口拿到的 json event
   * @param ip_address 用户 ip
   */
  async handleEvent(json: string, ip_address: string) {
    try {
      const event: OhbugEvent<any> = JSON.parse(json);
      console.log(ip_address, event);
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
