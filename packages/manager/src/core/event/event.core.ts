import {
  TOPIC_MANAGER_DATABASE_EVENT_ERROR,
  TOPIC_MANAGER_DATABASE_EVENT_FEEDBACK,
  TOPIC_MANAGER_DATABASE_EVENT_MESSAGE,
  TOPIC_MANAGER_DATABASE_EVENT_VIEW,
  TOPIC_MANAGER_DATABASE_EVENT_PERFORMANCE,
} from '@ohbug-server/common'

export const eventIndices = [
  {
    category: 'error',
    key: TOPIC_MANAGER_DATABASE_EVENT_ERROR,
    index: 'ohbug-event-error',
  },
  {
    category: 'message',
    key: TOPIC_MANAGER_DATABASE_EVENT_MESSAGE,
    index: 'ohbug-event-message',
  },
  {
    category: 'feedback',
    key: TOPIC_MANAGER_DATABASE_EVENT_FEEDBACK,
    index: 'ohbug-event-feedback',
  },
  {
    category: 'view',
    key: TOPIC_MANAGER_DATABASE_EVENT_VIEW,
    index: 'ohbug-event-view',
  },
  {
    category: 'performance',
    key: TOPIC_MANAGER_DATABASE_EVENT_PERFORMANCE,
    index: 'ohbug-event-performance',
  },
]
