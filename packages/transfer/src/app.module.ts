import { Module } from '@nestjs/common'

import { ApiModule } from './api.module'
import { SharedModule } from './shared.module'

@Module({
  imports: [ApiModule, SharedModule],
})
export class AppModule {}
