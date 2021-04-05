import type { Models } from '@rematch/core'

import { analysis } from './analysis'
import { app } from './app'
import { auth } from './auth'
import { event } from './event'
import { feedback } from './feedback'
import { invite } from './invite'
import { issue } from './issue'
import { notification } from './notification'
import { organization } from './organization'
import { project } from './project'
import { sourceMap } from './sourceMap'
import { user } from './user'
import { view } from './view'

export interface RootModel extends Models<RootModel> {
  analysis: typeof analysis
  app: typeof app
  auth: typeof auth
  event: typeof event
  feedback: typeof feedback
  invite: typeof invite
  issue: typeof issue
  notification: typeof notification
  organization: typeof organization
  project: typeof project
  sourceMap: typeof sourceMap
  user: typeof user
  view: typeof view
}

export const models: RootModel = {
  analysis,
  app,
  auth,
  event,
  feedback,
  invite,
  issue,
  notification,
  organization,
  project,
  sourceMap,
  user,
  view,
}

export * from './analysis'
export * from './app'
export * from './auth'
export * from './event'
export * from './feedback'
export * from './invite'
export * from './issue'
export * from './notification'
export * from './organization'
export * from './project'
export * from './sourceMap'
export * from './user'
export * from './view'
