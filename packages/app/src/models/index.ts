import type { Models } from '@rematch/core'

import { analysis } from './analysis'
import { app } from './app'
import { event } from './event'
import { feedback } from './feedback'
import { issue } from './issue'
import { notification } from './notification'
import { project } from './project'
import { sourceMap } from './sourceMap'
import { view } from './view'

export interface RootModel extends Models<RootModel> {
  analysis: typeof analysis
  app: typeof app
  event: typeof event
  feedback: typeof feedback
  issue: typeof issue
  notification: typeof notification
  project: typeof project
  sourceMap: typeof sourceMap
  view: typeof view
}

export const models: RootModel = {
  analysis,
  app,
  event,
  feedback,
  issue,
  notification,
  project,
  sourceMap,
  view,
}

export * from './analysis'
export * from './app'
export * from './event'
export * from './feedback'
export * from './issue'
export * from './notification'
export * from './project'
export * from './sourceMap'
export * from './view'
