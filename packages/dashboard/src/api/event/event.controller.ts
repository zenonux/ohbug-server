import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OhbugEventLike } from '@ohbug-server/common';

import { EventService } from './event.service';
import { GetEventByEventIdDto, GetEventsDto } from './event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 根据 event_id 取到对应 event 以及受影响的用户数
   *
   * @param event_id
   * @param project_id
   * @param issue_id
   */
  @Get('/:event_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async get(
    @Param()
    { event_id }: GetEventByEventIdDto,
    @Query()
    { issue_id }: GetEventsDto,
  ): Promise<OhbugEventLike> {
    if (event_id === 'latest' && issue_id) {
      return await this.eventService.getLatestEventByIssueId(issue_id);
    }
    return await this.eventService.getEventByEventId(event_id);
  }
}
