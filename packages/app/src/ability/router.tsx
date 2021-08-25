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
import { Loading, Header } from '@/components'

import { routes, Route } from '@/config'

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
const Container: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = React.useState<Route | null>(null)
  React.useEffect(() => {
    setRoute(matchRoute(routes, location))
  }, [location.key])

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
            <Layout.Header className="w-full fixed top-0 z-10 backdrop-filter backdrop-blur shadow-sm">
              <Header />
            </Layout.Header>
          )}
          <React.Suspense fallback={<Loading />}>
            <Layout.Content style={{ paddingTop: 60 }}>
              {children}
            </Layout.Content>
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
