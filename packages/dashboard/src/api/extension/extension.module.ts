import { Module, HttpModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Extension } from './extension.entity'
import { ExtensionController } from './extension.controller'
import { ExtensionService } from './extension.service'

@Module({
  imports: [TypeOrmModule.forFeature([Extension]), HttpModule],
  controllers: [ExtensionController],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ExtensionModule {}
