import { Router } from './components/core.cmp'
import { Dashboard } from './interface/dashboard/core.board'
import { Auth } from './interface/dashboard/auth.board'
import { Event } from './event'


export const App = () => {
  return (
    <Router>
      <Auth path='/auth' />
      <Dashboard path='/dashboard' />
      <Event path='/event' />
    </Router>
  )
}