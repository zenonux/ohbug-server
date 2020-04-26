import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueModule } from '@/api/issue/issue.module';
import { ProjectModule } from '@/api/project/project.module';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => IssueModule),
    ProjectModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
