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

import { EventService } from './event.service';
import {
  GetEventByEventIdDto,
  GetEventsDto,
  SearchEventsDto,
} from './event.dto';
import { Event } from './event.entity';
import type { EventsResult } from './event.interface';

const limit = 20;

@Controller('event')
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
  async getEventByEventId(
    @Param()
    { event_id }: GetEventByEventIdDto,
    @Query()
    { project_id, issue_id }: GetEventsDto,
  ): Promise<Event> {
    if (event_id === 'latest' && issue_id) {
      return await this.eventService.getLatestEventByIssueId(issue_id);
    }
    const event = await this.eventService.getEventByEventId(
      event_id,
      project_id,
    );
    return event;
  }

  /**
   * search events
   *
   * @param project_id
   * @param page
   * @param issue_id
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async searchEvents(
    @Query()
    { project_id, page, issue_id, type, user, start, end }: SearchEventsDto,
  ): Promise<EventsResult> {
    const skip = parseInt(page, 10) * limit;
    const searchCondition = { issue_id, type, user, start, end };
    const events = await this.eventService.searchEvents({
      project_id,
      searchCondition,
      limit,
      skip,
    });
    return events;
  }
}
