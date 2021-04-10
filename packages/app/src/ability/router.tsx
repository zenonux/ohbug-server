import React from 'react'
import { match } from 'path-to-regexp'
import { Layout } from 'antd'

import {
  Redirect,
  Location,
  Router,
  useLocation,
  WindowLocation,
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
  }, [location.key])

  let Wrapper = React.Fragment
  if (route?.wrapper) {
    Wrapper = React.lazy(() => import(/* @vite-ignore */ route.wrapper!))
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <Wrapper>
        <Layout>
          {!(route?.layout?.hideNav === true) && (
            <Layout.Sider width={65}>
              <Sider />
            </Layout.Sider>
          )}

          <React.Suspense fallback={<Loading />}>
            <Layout>
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
        const Component = React.lazy(
          () => import(/* @vite-ignore */ route.component!)
        )

        if (!route.routes) {
          if (route.redirect) {
            return (
              <Redirect
                from={route.path}
                to={route.redirect}
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
