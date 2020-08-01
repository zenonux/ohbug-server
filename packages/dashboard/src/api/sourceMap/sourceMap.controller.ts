import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { SourceMapService } from './sourceMap.service';
import {
  ReceiveSourceMapDto,
  GetSourceMapsDto,
  DeleteSourceMapsDto,
} from './sourceMap.dto';
import type { ReceiveSourceMapFile } from './sourceMap.interface';
import { SourceMap } from './sourceMap.entity';

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
  ): Promise<void> {
    return await this.sourceMapService.handleSourceMap(
      file,
      receiveSourceMapDto,
    );
  }

  /**
   * 根据 apiKey 获取 sourceMaps
   *
   * @param apiKey
   */
  @Get(':apiKey')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param() { apiKey }: GetSourceMapsDto): Promise<SourceMap[]> {
    return await this.sourceMapService.getSourceMapsByApiKey({ apiKey });
  }

  /**
   * 根据 id 删除 sourceMap
   *
   * @param id
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @Param()
    { id }: DeleteSourceMapsDto,
  ): Promise<boolean> {
    return await this.sourceMapService.deleteSourceMapById({
      id,
    });
  }
}
