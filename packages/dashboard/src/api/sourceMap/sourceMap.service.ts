import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { getStackFrame, getTheSourceByError } from 'source-map-trace';
import { unlinkSync } from 'fs';

import { ForbiddenException } from '@ohbug-server/common';
import type { OhbugEventLike } from '@ohbug-server/common';
import { ProjectService } from '@/api/project/project.service';

import { SourceMap } from './sourceMap.entity';
import {
  DeleteSourceMapsDto,
  GetSourceMapsDto,
  ReceiveSourceMapDto,
} from './sourceMap.dto';
import type { ReceiveSourceMapFile } from './sourceMap.interface';

@Injectable()
export class SourceMapService {
  constructor(
    @InjectQueue('sourceMap') private sourceMapQueue: Queue,
    @InjectRepository(SourceMap)
    private readonly sourceMapRepository: Repository<SourceMap>,
    private readonly projectService: ProjectService,
  ) {}

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
        await this.sourceMapQueue.add('sourceMapFile', {
          file,
          receiveSourceMapDto,
        });
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
   * @param apiKey
   * @param appVersion
   * @param appType
   * @param event
   */
  async getSource({ apiKey, appVersion, appType, detail }: OhbugEventLike) {
    try {
      const sourceMap = await this.sourceMapRepository.findOne({
        apiKey,
        appVersion,
        appType,
      });
      if (sourceMap) {
        const stackFrame = getStackFrame(detail);
        if (stackFrame) {
          const sourceMapTarget = sourceMap.data.find(({ originalname }) => {
            const sourceFileName = originalname.split('.map')[0];
            return stackFrame.fileName.includes(sourceFileName);
          });

          if (sourceMapTarget) {
            return await getTheSourceByError(sourceMapTarget.path, detail);
          }
        }
      }
    } catch (error) {
      throw new ForbiddenException(400903, error);
    }
  }

  /**
   * 根据 apiKey 获取 sourceMaps
   *
   * @param apiKey
   */
  async getSourceMapsByApiKey({ apiKey }: GetSourceMapsDto) {
    try {
      const sourceMaps = await this.sourceMapRepository.find({ apiKey });
      return sourceMaps;
    } catch (error) {
      throw new ForbiddenException(400904, error);
    }
  }

  /**
   * 根据 id 删除 sourceMap
   *
   * @param id
   */
  async deleteSourceMapById({ id }: DeleteSourceMapsDto) {
    try {
      const sourceMap = await this.sourceMapRepository.findOneOrFail(id);

      sourceMap.data.forEach(({ path }) => {
        unlinkSync(path);
        // tslint:disable-next-line:no-console
        console.log(`successfully deleted ${path}`);
      });
      return Boolean(await this.sourceMapRepository.remove(sourceMap));
    } catch (error) {
      throw new ForbiddenException(400905, error);
    }
  }
}
