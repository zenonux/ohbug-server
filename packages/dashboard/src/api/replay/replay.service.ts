import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ForbiddenException } from '@ohbug-server/common';

import { Replay } from './replay.entity';

@Injectable()
export class ReplayService {
  constructor(
    @InjectRepository(Replay)
    private readonly replayRepository: Repository<Replay>,
  ) {}

  /**
   * create replay
   *
   * @param replay
   */
  async createReplay(replay: DeepPartial<Replay>): Promise<Replay> {
    try {
      return await this.replayRepository.create(replay);
    } catch (error) {
      throw new ForbiddenException(400700, error);
    }
  }
}
