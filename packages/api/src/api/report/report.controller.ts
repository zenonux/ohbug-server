import { Controller, Get, Query, Post } from '@nestjs/common';

import { PlainBody } from '@/core/decorators/plain-body.decorator';
import { IpAddress } from '@/core/decorators/IpAddress.decorator';

import { ReportService } from './report.service';

/**
 * 用于接受上报，经过处理后入库
 * 唯一对外暴露的接口，提供 GET/POST 两种方式
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 上报接口 (GET)
   *
   * @param json 上报的 json 版 Events
   */
  @Get()
  async receiveEventsFromGet(
    @Query('event') json: string,
    @IpAddress() ip_address: string,
  ): Promise<void> {
    await this.reportService.processingAndSaveEvent(json, ip_address);
  }

  /**
   * 上报接口 (POST)
   *
   * @param json 上报的 json 版 Events
   */
  @Post()
  async receiveEventsFromPost(
    @PlainBody() json: string,
    @IpAddress() ip_address: string,
  ): Promise<void> {
    await this.reportService.processingAndSaveEvent(json, ip_address);
  }
}
