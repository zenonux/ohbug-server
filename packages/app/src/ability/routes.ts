import React from 'react'
import type { RouteComponentProps } from '@/ability'
export interface Route {
  path: string
  wrapper?: React.FC<RouteComponentProps>
  redirect?: string
  component?: React.FC<RouteComponentProps>
  menu?: {
    name: string
    icon: string
  }
  layout?: {
    hideNav?: boolean
    hideFooter?: boolean
  }
  routes?: Route[]
  default?: boolean
}

import Auth from '@/components/renders/Auth'
import GettingStarted from '@/pages/getting-started'
import Issue from '@/pages/issue'
import Event from '@/pages/event'
import Settings from '@/pages/settings'
import NotificationRules from '@/pages/settings/Notification/Rules'
import NotificationSetting from '@/pages/settings/Notification/Setting'
import SourceMap from '@/pages/settings/SourceMap'
import NotFound from '@/pages/not-found'
import NotAuthorized from '@/pages/not-authorized'

const routes: Route[] = [
  {
    path: '/',
    wrapper: Auth,
    redirect: '/issue',
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/issue',
    component: Issue,
    wrapper: Auth,
    // layout
    menu: {
      name: '问题',
      icon: 'icon-ohbug-error-warning-line',
    },
    routes: [
      {
        path: '/issue/:issue_id/event/:event_id',
        component: Event,
        wrapper: Auth,
      },
    ],
  },
  {
    path: '/event/:target',
    component: Event,
    wrapper: Auth,
  },
  {
    path: '/settings',
    component: Settings,
    wrapper: Auth,
    redirect: '/settings/notification_rules',
    // layout
    menu: {
      name: '设置',
      icon: 'icon-ohbug-settings-3-line',
    },
    routes: [
      {
        path: 'notification_rules',
        component: NotificationRules,
      },
      {
        path: 'notification_setting',
        component: NotificationSetting,
      },
      {
        path: 'sourcemap',
        component: SourceMap,
      },
    ],
  },
  {
    default: true,
    path: '/404',
    component: NotFound,
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/403',
    component: NotAuthorized,
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
]

export default routes
