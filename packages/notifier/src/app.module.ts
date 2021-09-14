import { Module } from '@nestjs/common'

import { CoreModule } from './core.module'
import { SharedModule } from './shared.module'

@Module({
  imports: [CoreModule, SharedModule],
  exports: [CoreModule],
})
export class AppModule {}
