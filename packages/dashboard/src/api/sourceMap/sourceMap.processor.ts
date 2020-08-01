import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { unlinkSync } from 'fs';
import { uniq } from 'ramda';

import { ForbiddenException } from '@ohbug-server/common';
import { SourceMap } from '@/api/sourceMap/sourceMap.entity';

@Processor('sourceMap')
export class SourceMapConsumer {
  constructor(
    @InjectRepository(SourceMap)
    private readonly sourceMapRepository: Repository<SourceMap>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 管理 sourceMap 文件的储存
   * 1. 根据 apiKey 检查 sourceMap 数据量是否超过最大值 others.sourceMap.max
   * 2. 超过 -> 返回拒绝
   * 3. 不超过 -> 判断有没有 appVersion 和 appType 同时符合的数据
   * 4. 有 -> data 叠加
   * 5. 无 -> 创建
   *
   * @param job
   */
  @Process('sourceMapFile')
  async handleSourceMap(job: Job) {
    try {
      const { file, receiveSourceMapDto } = job.data;
      const { apiKey, appVersion, appType } = receiveSourceMapDto;
      // 先查有没有已经存的
      const sourceMaps = await this.sourceMapRepository.find({
        apiKey,
      });
      const maxSourceMap = this.configService.get('others.sourceMap.max');
      if (sourceMaps.length >= maxSourceMap) {
        throw new Error('sourceMap 文件数量已达到最大值');
      } else {
        const matchSourceMap = sourceMaps.find(
          (s) => s.appVersion === appVersion && s.appType === appType,
        );
        if (matchSourceMap) {
          let data = matchSourceMap.data;
          // 这一步要对比新文件与老文件是否重复，若重复删除老的文件
          const oldFile = matchSourceMap.data.find(
            ({ originalname }) => originalname === file.originalname,
          );
          if (oldFile) {
            unlinkSync(oldFile.path);
            data = data.filter(({ path }) => path !== oldFile.path);
            // tslint:disable-next-line:no-console
            console.log(`successfully deleted ${oldFile.path}`);
          }
          // 如果有则新增 data
          matchSourceMap.data = uniq([...data, file]);
          return await this.sourceMapRepository.save(matchSourceMap);
        } else {
          // 如果没有则新建
          const sourceMap = await this.sourceMapRepository.create({
            apiKey,
            appVersion,
            appType,
            data: [file],
          });
          return await this.sourceMapRepository.save(sourceMap);
        }
      }
    } catch (error) {
      throw new ForbiddenException(400900, error);
    }
  }
}
