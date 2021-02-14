import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@/api/user/user.module'

import { Organization } from './organization.entity'
import { OrganizationController } from './organization.controller'
import { OrganizationService } from './organization.service'

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
