import React from 'react'
import { match } from 'path-to-regexp'
import { Layout, PageHeader } from 'antd'

import {
  Redirect,
  Location,
  Router,
  useLocation,
  WindowLocation,
  navigate,
} from '@/ability'
import { Loading, Sider, Footer } from '@/components'

import routes, { Route } from './routes'

function matchRoute(routes: Route[], location: WindowLocation): Route | null {
  for (const route of routes) {
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
const Container: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = React.useState<Route | null>(null)
  React.useEffect(() => {
    setRoute(matchRoute(routes, location))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  const Wrapper = route?.wrapper ? route?.wrapper : React.Fragment
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
              width={65}
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}
            >
              <Sider />
            </Layout.Sider>
          )}

          <React.Suspense fallback={<Loading />}>
            <Layout style={{ marginLeft: 65 }}>
              {route?.title && (
                <Layout.Header
                  style={{ position: 'sticky', top: 0, zIndex: 10 }}
                >
                  <PageHeader
                    title={route.title}
                    onBack={() => navigate(-1)}
                    ghost={false}
                  />
                </Layout.Header>
              )}
              <Layout.Content>{children}</Layout.Content>

              {!(route?.layout?.hideFooter === true) && <Footer />}
            </Layout>
          </React.Suspense>
        </Layout>
      </Wrapper>
    </React.Suspense>
  )
}

function renderRoutes(routes: Route[]) {
  return routes
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
      } else if (route.redirect) {
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
