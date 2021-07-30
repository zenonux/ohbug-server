import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
} from '@nestjs/common'

import type { OhbugEventLike } from '@ohbug-server/common'

import { EventService } from './event.service'
import { GetEventByEventIdDto, GetEventsDto } from './event.dto'

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 根据 eventId 取到对应 event 以及受影响的用户数
   *
   * @param eventId
   * @param issueId
   * @param event_index
   */
  @Get(':eventId')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(
    @Param()
    { eventId }: GetEventByEventIdDto,
    @Query()
    { issueId }: GetEventsDto
  ): Promise<OhbugEventLike | null> {
    if (issueId) {
      if (eventId === 'latest') {
        return this.eventService.getLatestEventByIssueId(issueId)
      }
      return this.eventService.getEventByEventId(eventId, issueId)
    }
    return null
  }
}
