export interface Route {
  path: string
  wrapper?: string
  redirect?: string
  component?: string
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

function parsePath(path: string) {
  if (typeof path !== 'string') {
    throw new Error(`Should input a path string, got ${path}`)
  }
  if (path[0] === '@' && path[1] === '/') {
    return path.replace('@/', '../') + '/index.ts'
  }
  return path + '/index.ts'
}
function createRoutes(routes: Route[]): Route[] {
  return routes.map((route) => {
    const _route = { ...route }
    if (_route.wrapper) {
      _route.wrapper = parsePath(_route.wrapper)
    }
    if (_route.component) {
      _route.component = parsePath(_route.component)
    }
    if (_route.routes) {
      _route.routes = createRoutes(_route.routes)
    }
    return _route
  })
}

const routes: Route[] = [
  {
    path: '/',
    wrapper: '@/components/renders/Auth',
    redirect: '/organization-project',
  },
  {
    path: '/organization-project',
    component: '@/pages/organization-project',
    wrapper: '@/components/renders/Auth',
    // layout
    menu: {
      name: '团队项目',
      icon: 'icon-ohbug-projector-line',
    },
    routes: [
      {
        path: '/:project_id/getting-started',
        component: '@/pages/getting-started',
        wrapper: '@/components/renders/Auth',
      },
    ],
  },
  {
    path: '/issue',
    component: '@/pages/issue',
    wrapper: '@/components/renders/Auth',
    // layout
    menu: {
      name: '问题',
      icon: 'icon-ohbug-error-warning-line',
    },
    routes: [
      {
        path: '/:issue_id/event/:event_id',
        component: '@/pages/event',
        wrapper: '@/components/renders/Auth',
      },
    ],
  },
  {
    path: '/event/:target',
    component: '@/pages/event',
    wrapper: '@/components/renders/Auth',
  },
  {
    path: '/settings/:organization_id',
    component: '@/pages/settings',
    wrapper: '@/components/renders/Auth',
    redirect: '/settings/:organization_id/profile',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
    routes: [
      {
        path: '/profile',
        component: '@/pages/settings/Organization/Profile',
      },
      {
        path: '/projects',
        component: '@/pages/settings/Organization/Projects',
        routes: [
          // project settings
          {
            path: '/:project_id',
            redirect: '/settings/:organization_id/project/:project_id/profile',
            routes: [
              {
                path: '/profile',
                component: '@/pages/settings/Project/Profile',
              },
              {
                path: '/notification_rules',
                component: '@/pages/settings/Project/Notification/Rules',
              },
              {
                path: '/notification_setting',
                component: '@/pages/settings/Project/Notification/Setting',
              },
              {
                path: '/sourcemap',
                component: '@/pages/settings/Project/SourceMap',
              },
              {
                path: '/members',
                component: '@/pages/settings/Project/Members',
              },
            ],
          },
        ],
      },
      {
        path: '/members',
        component: '@/pages/settings/Organization/Members',
      },
    ],
  },
  // {
  //   path: '/feedback',
  //   component: '@/pages/Feedback',
  //   wrapper: '@/components/renders/Auth',
  //   // layout
  //   menu: {
  //     name: '反馈 Feedback',
  //     icon: 'coffee',
  //   },
  // },
  {
    path: '/signup',
    component: '@/pages/signup',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/activate',
    component: '@/pages/activate',
    layout: {
      hideNav: true,
    },
  },
  {
    path: '/login',
    component: '@/pages/login',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/reset',
    component: '@/pages/reset',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/create-organization',
    component: '@/pages/create-organization',
    wrapper: '@/components/renders/Auth',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/create-project',
    component: '@/pages/create-project',
    wrapper: '@/components/renders/Auth',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/getting-started',
    component: '@/pages/getting-started',
    wrapper: '@/components/renders/Auth',
  },
  {
    path: '/invite',
    component: '@/pages/invite',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/404',
    component: '@/pages/not-found',
    default: true,
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
  {
    path: '/403',
    component: '@/pages/not-authorized',
    layout: {
      hideNav: true,
      hideFooter: true,
    },
  },
]

export default createRoutes(routes)
