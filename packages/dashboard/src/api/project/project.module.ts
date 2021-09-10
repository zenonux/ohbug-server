import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MicroserviceManagerClientModule, Project } from '@ohbug-server/common'

import { NotificationModule } from '../notification/notification.module'
import { ExtensionModule } from '../extension/extension.module'
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
