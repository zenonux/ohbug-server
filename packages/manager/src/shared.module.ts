import { Global, Module } from '@nestjs/common'

import { OrmModule, RedisModule } from '@ohbug-server/common'

@Global()
@Module({
  imports: [OrmModule, RedisModule],
})
export class SharedModule {}
