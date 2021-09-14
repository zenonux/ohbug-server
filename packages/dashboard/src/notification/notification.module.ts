import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NotificationRule, NotificationSetting } from '@ohbug-server/common'

import { ProjectModule } from '../project/project.module'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationRule, NotificationSetting]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
