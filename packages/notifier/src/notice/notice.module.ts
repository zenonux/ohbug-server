import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ConfigModule } from '@ohbug-server/common'

import { NoticeService } from './notice.service'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
