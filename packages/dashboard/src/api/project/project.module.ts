import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MicroserviceManagerClientModule } from '@ohbug-server/common'
import { UserModule } from '@/api/user/user.module'
import { OrganizationModule } from '@/api/organization/organization.module'
import { NotificationModule } from '@/api/notification/notification.module'

import { Project } from './project.entity'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MicroserviceManagerClientModule,
    UserModule,
    OrganizationModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
