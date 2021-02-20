import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { ApiModule } from './api/api.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'app'),
      exclude: ['/api/v1*'],
    }),
    ApiModule,
    SharedModule,
  ],
})
export class AppModule {}
