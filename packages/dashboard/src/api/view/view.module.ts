import { Module } from '@nestjs/common';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService],
  exports: [ViewService],
})
export class ViewModule {}
