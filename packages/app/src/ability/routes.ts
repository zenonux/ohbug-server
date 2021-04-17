import React from 'react'
import type { RouteComponentProps } from '@/ability'

export interface Route {
  path: string
  wrapper?: React.FC
  redirect?: string
  component?: React.FC<RouteComponentProps>
  title?: React.ReactNode
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
const GettingStarted = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/getting-started')
)
const CreateProject = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/create-project')
)
const Project = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/project')
)
const Issue = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/issue')
)
const Event = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/event')
)
const Settings = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/settings')
)
const NotificationRules = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/settings/Notification/Rules')
)
const NotificationSetting = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/settings/Notification/Setting')
)
const SourceMap = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/settings/SourceMap')
)
const NotFound = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/not-found')
)
const NotAuthorized = React.lazy<React.FC<RouteComponentProps>>(
  () => import('../pages/not-authorized')
)

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
    path: '/create-project',
    component: CreateProject,
  },
  {
    path: '/project',
    component: Project,
    wrapper: Auth,
    // layout
    menu: {
      name: '项目',
      icon: 'icon-ohbug-projector-line',
    },
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
  },
  {
    path: '/issue/:issue_id/event/:event_id',
    component: Event,
    wrapper: Auth,
    title: 'Event',
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
