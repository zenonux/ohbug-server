import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MicroserviceManagerClientModule } from '@ohbug-server/common'
import { NotificationModule } from '@/api/notification/notification.module'
import { ExtensionModule } from '@/api/extension/extension.module'

import { Project } from './project.entity'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MicroserviceManagerClientModule,
    forwardRef(() => NotificationModule),
    ExtensionModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
