import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ReportService } from './report.service';

/**
 * 用于接收上报数据
 * 唯一对外暴露的接口
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 上报接口 (GET)
   *
   * @param event 通过上报接口拿到的 event
   */
  @Get()
  receiveEventFromGet(@Query('event') event: string): void {
    const ip_address = null;
    this.reportService.handleEvent(event, ip_address);
  }

  /**
   * 上报接口 (Post)
   *
   * @param event 通过上报接口拿到的 event
   */
  @Post()
  receiveEventFromPost(@Body() event: any): void {
    const ip_address = null;
    this.reportService.handleEvent(event, ip_address);
  }
}
