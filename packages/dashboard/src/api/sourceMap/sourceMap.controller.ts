import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SourceMapService } from './sourceMap.service';
import { ReceiveSourceMapDto } from './sourceMap.dto';
import { SourceMap } from './sourceMap.entity';
import type { ReceiveSourceMapFile } from './sourceMap.interface';

/**
 * 用于接受上报 SourceMap，经过处理后入库
 */
@Controller('sourceMap')
export class SourceMapController {
  constructor(private readonly sourceMapService: SourceMapService) {}

  /**
   * 接受上传的 sourceMap 文件和相关 app 信息并存储
   *
   * @param file sourceMap 文件相关信息
   * @param receiveSourceMapDto 此文件对应的 app 信息
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async receiveSourceMap(
    @UploadedFile() file: ReceiveSourceMapFile,
    @Body() receiveSourceMapDto: ReceiveSourceMapDto,
  ): Promise<SourceMap> {
    return await this.sourceMapService.handleSourceMap(
      file,
      receiveSourceMapDto,
    );
  }
}
