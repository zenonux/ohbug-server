import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MicroserviceClientModule } from '@ohbug-server/common';
import { UserModule } from '@/api/user/user.module';
import { OrganizationModule } from '@/api/organization/organization.module';

import { Project } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MicroserviceClientModule,
    UserModule,
    OrganizationModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
