import { Module, HttpModule } from '@nestjs/common';

import { NoticeService } from './notice.service';

@Module({
  imports: [HttpModule],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
