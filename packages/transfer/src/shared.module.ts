import { Global, Module } from '@nestjs/common'

import { RedisModule } from '@ohbug-server/common'

@Global()
@Module({
  imports: [RedisModule],
})
export class SharedModule {}
