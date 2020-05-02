import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
})
export class ManagerModule {}
