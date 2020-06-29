import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '@/api/project/project.module';
import { OrganizationModule } from '@/api/organization/organization.module';
import { UserModule } from '@/api/user/user.module';

import { Invite } from './invite.entity';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite]),
    ProjectModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
