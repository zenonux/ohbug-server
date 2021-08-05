import React from 'react'
import { match } from 'path-to-regexp'
import { Layout } from 'antd'

import {
  Redirect,
  Location,
  Router,
  useLocation,
  WindowLocation,
  navigate,
} from '@/ability'
import { Loading, Sider, Footer } from '@/components'
import { useBoolean } from '@/hooks'

import routes, { Route } from './routes'

function matchRoute(data: Route[], location: WindowLocation): Route | null {
  for (const route of data) {
    const m = match(route.path)
    const result = m(location.pathname)
    if (result) {
      return route
    }
    if (route.routes) {
      matchRoute(route.routes, location)
    }
  }
  return null
}
const siderCollapsedWidth = 80
const siderWidth = 220
const Container: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = React.useState<Route | null>(null)
  React.useEffect(() => {
    setRoute(matchRoute(routes, location))
  }, [location.key])
  const [collapsed, { toggle: toggleCollapsed }] = useBoolean(false)

  const Wrapper = route?.wrapper ?? React.Fragment
  // wrapper 和 redirect 同时存在时优先处理 redirect
  if (route?.wrapper && route.redirect) {
    navigate(route.redirect, { replace: true })
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <Wrapper>
        <Layout>
          {!(route?.layout?.hideNav === true) && (
            <Layout.Sider
              theme="light"
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}
              width={siderWidth}
              collapsedWidth={siderCollapsedWidth}
              collapsible
              collapsed={collapsed}
              onCollapse={toggleCollapsed}
            >
              <Sider collapsed={collapsed} />
            </Layout.Sider>
          )}
          <React.Suspense fallback={<Loading />}>
            <Layout
              style={{
                marginLeft: collapsed ? siderCollapsedWidth : siderWidth,
                transition: 'margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              }}
            >
              <Layout.Content>{children}</Layout.Content>
              {!(route?.layout?.hideFooter === true) && (
                <Layout.Footer style={{ padding: 0 }}>
                  <Footer />
                </Layout.Footer>
              )}
            </Layout>
          </React.Suspense>
        </Layout>
      </Wrapper>
    </React.Suspense>
  )
}

function renderRoutes(data: Route[]) {
  return data
    .map((route) => {
      if (route.component) {
        const Component = route?.component

        if (!route.routes) {
          if (route.redirect) {
            return (
              <Redirect
                from={route.path}
                to={route.redirect}
                noThrow
                key={route.redirect}
              />
            )
          }
          return (
            <Component
              path={route.path}
              default={route.default}
              key={route.path}
            />
          )
        }
        return (
          <Component path={route.path} default={route.default} key={route.path}>
            {renderRoutes(route.routes)}
          </Component>
        )
      }
      if (route.redirect) {
        return (
          <Redirect
            from={route.path}
            to={route.redirect}
            noThrow
            key={route.redirect}
          />
        )
      }
      return null
    })
    .filter((v) => !!v)
}

const RouterComponent: React.FC = () => (
  <Location>
    {({ location }) => (
      <Container>
        <Router location={location}>{renderRoutes(routes)}</Router>
      </Container>
    )}
  </Location>
)

export default RouterComponent
