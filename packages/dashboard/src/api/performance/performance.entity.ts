import { Entity, Column } from 'typeorm';

import { Event } from '@/api/event/event.entity';

@Entity()
export class Performance extends Event {
  @Column({ type: 'jsonb', nullable: true })
  navigationTiming?: any;

  @Column({ type: 'jsonb', nullable: true })
  resourceTiming?: any;

  @Column({ type: 'jsonb', nullable: true })
  dataConsumption?: any;

  @Column({ type: 'jsonb', nullable: true })
  networkInformation?: any;

  @Column({ type: 'real', nullable: true })
  firstPaint?: number;

  @Column({ type: 'real', nullable: true })
  firstContentfulPaint?: number;

  @Column({ type: 'real', nullable: true })
  firstInputDelay?: number;

  @Column({ type: 'real', nullable: true })
  largestContentfulPaint?: number;
}
