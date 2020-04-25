import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SourceMapTrace from 'source-map-trace';
import * as stackParse from 'stack-parser';

import { ForbiddenException } from '@/core/exceptions/forbidden.exception';
import { ProjectService } from '@/api/project/project.service';

import { SourceMap } from './sourceMap.entity';
import { ReceiveSourceMapDto } from './sourceMap.dto';
import type {
  ReceiveSourceMapFile,
  GetSourceByAppVersionParams,
} from './sourceMap.interface';

@Injectable()
export class SourceMapService {
  constructor(
    @InjectRepository(SourceMap)
    private readonly sourceMapRepository: Repository<SourceMap>,
    private readonly projectService: ProjectService,
  ) {}

  async createSourceMap(
    file: ReceiveSourceMapFile,
    receiveSourceMapDto: ReceiveSourceMapDto,
  ): Promise<SourceMap> {
    try {
      const { apiKey, appVersion, appType } = receiveSourceMapDto;
      let sourceMapObject: SourceMap;
      // 先查有没有已经存的
      sourceMapObject = await this.sourceMapRepository.findOne({
        apiKey,
        appVersion,
      });
      if (sourceMapObject) {
        // 如果有则合并 data
        // TODO 相同版本的 sourceMap 可能需要覆盖并删除掉 uploads 文件夹内的 map 文件
        sourceMapObject.data = sourceMapObject.data.concat(file);
      } else {
        // 如果没有则新建
        sourceMapObject = await this.sourceMapRepository.create({
          apiKey,
          appVersion,
          appType,
          data: [file],
        });
      }
      return await this.sourceMapRepository.save(sourceMapObject);
    } catch (error) {
      throw new ForbiddenException(400900, error);
    }
  }

  /**
   * 接受上传的 sourceMap 文件和相关 app 信息并存储
   * 这里是上传的单条 sourceMap，createSourceMap 时应该对同一次 build 的内容进行合并
   *
   * @param file sourceMap 文件相关信息
   * @param receiveSourceMapDto 此文件对应的 app 信息
   */
  async handleSourceMap(
    file: ReceiveSourceMapFile,
    receiveSourceMapDto: ReceiveSourceMapDto,
  ) {
    try {
      const project = await this.projectService.getProjectByApiKey(
        receiveSourceMapDto.apiKey,
      );
      if (project) {
        return await this.createSourceMap(file, receiveSourceMapDto);
      }
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        throw new ForbiddenException(400901);
      } else {
        throw new ForbiddenException(400902, error);
      }
    }
  }

  /**
   * 根据 SourceMap 文件获取原始 code
   *
   * @param sourceMapFilePath
   * @param line
   * @param column
   */
  async getSourceByAppVersion({
    apiKey,
    appVersion,
    stack,
  }: GetSourceByAppVersionParams) {
    try {
      const sourceMap = await this.sourceMapRepository.findOne({
        apiKey,
        appVersion,
      });

      const ast = stackParse.parse(stack);
      const stack0 = ast[0];
      const sourceMapTarget = sourceMap.data.find((s) => {
        const sourceFileName = s.originalname.split('.map')[0];
        return stack0.file.includes(sourceFileName);
      });
      const source = await SourceMapTrace(
        sourceMapTarget.path,
        parseInt(stack0.line, 10),
        parseInt(stack0.column, 10),
      );

      return source;
    } catch (error) {
      throw new ForbiddenException(400903, error);
    }
  }
}
