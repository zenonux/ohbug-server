import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  ClassSerializerInterceptor,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import type { ReceiveSourceMapFile } from '@ohbug-server/types'
import { SourceMap } from '@ohbug-server/common'

import { SourceMapService } from './sourceMap.service'
import {
  ReceiveSourceMapDto,
  GetSourceMapsDto,
  DeleteSourceMapsDto,
} from './sourceMap.dto'

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
    @Body() receiveSourceMapDto: ReceiveSourceMapDto
  ): Promise<void> {
    return this.sourceMapService.handleSourceMap(file, receiveSourceMapDto)
  }

  /**
   * 根据 apiKey 获取 sourceMaps
   *
   * @param apiKey
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Query() { apiKey }: GetSourceMapsDto): Promise<SourceMap[]> {
    return this.sourceMapService.getSourceMapsByApiKey({ apiKey })
  }

  /**
   * 根据 id 删除 sourceMap
   *
   * @param id
   * @param apiKey
   */
  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @Param()
    { id }: DeleteSourceMapsDto,
    @Query() { apiKey }: GetSourceMapsDto
  ): Promise<boolean> {
    return this.sourceMapService.deleteSourceMapById({
      id,
      apiKey,
    })
  }
}
