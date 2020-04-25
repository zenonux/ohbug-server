import { Entity } from 'typeorm';

import { Event } from '@/api/event/event.entity';

@Entity()
export class View extends Event {}
