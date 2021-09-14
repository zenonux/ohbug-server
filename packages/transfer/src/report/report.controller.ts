import { Controller, Post, Body, Ip, Req } from '@nestjs/common'
import type { OhbugEvent } from '@ohbug/types'
import rawbody from 'raw-body'

import { ReportService } from './report.service'

/**
 * 用于接收上报数据
 * 唯一对外暴露的接口
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 上报接口 (Post)
   *
   * @param event 通过上报接口拿到的 event
   * @param ip
   * @param req
   */
  @Post()
  async receiveEventFromPost(
    @Body() event: OhbugEvent<any>,
    @Ip() ip: string,
    @Req() req: any
  ): Promise<void> {
    if (req.readable) {
      const raw = await rawbody(req)
      const json = raw.toString().trim()
      this.reportService.handleEvent(JSON.parse(json), ip)
    } else {
      this.reportService.handleEvent(event, ip)
    }
  }
}
