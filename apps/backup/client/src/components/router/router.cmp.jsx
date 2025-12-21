import { useSnapshot } from 'valtio'
import { STRoute } from '../../stores/app.store'
import { useEffect } from 'react'


export const Router = (props) => {
  const SSRoute = useSnapshot(STRoute)


  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams
    for (let param of params.keys()) {
      STRoute.params[param] = params.get(param)
    }

    const onNavigation = (e) => {
      STRoute.path = e.target.location.pathname
      window.history.replaceState({}, '', e.target.location.pathname)
    }

    window.addEventListener('popstate', onNavigation)
    return () => window.removeEventListener('popstate', onNavigation)
  }, [STRoute.path])


  useEffect(() => {
    const publicRoutes = ['/event', '/upload']
    if (!publicRoutes.includes(STRoute.path)) {
      const path = localStorage.getItem('SIGNED_IN') ? '/dashboard' : '/auth'
      goTo(path)
    }
  }, [])


  return props.children.filter(c => c.props.path === SSRoute.path)
}


export const goTo = (path = '/') => {
  const url = new URL(window.location.origin + path)
  window.history.pushState({}, '', path)

  STRoute.path = url.pathname
}