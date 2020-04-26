import { Controller, Get, Query, Post } from '@nestjs/common';

import { PlainBody, IpAddress } from '@ohbug-server/common';

import { ReportService } from './report.service';

/**
 * 用于接收上报数据
 * 唯一对外暴露的接口，提供 GET/POST 两种方式
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 上报接口 (GET)
   *
   * @param json 通过上报接口拿到的 json event
   * @param ip_address 用户 ip
   */
  @Get()
  async receiveEventFromGet(
    @Query('event') json: string,
    @IpAddress() ip_address: string,
  ): Promise<void> {
    await this.reportService.handleEvent(json, ip_address);
  }

  /**
   * 上报接口 (POST)
   *
   * @param json 通过上报接口拿到的 json event
   * @param ip_address 用户 ip
   */
  @Post()
  async receiveEventFromPost(
    @PlainBody() json: string,
    @IpAddress() ip_address: string,
  ): Promise<void> {
    await this.reportService.handleEvent(json, ip_address);
  }
}
