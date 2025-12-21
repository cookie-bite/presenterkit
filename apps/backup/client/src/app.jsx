import { Router } from './components/core.cmp'
import { Dashboard } from './interface/dashboard/core.board'
import { Auth } from './interface/dashboard/auth.board'
import { Upload } from './interface/upload/core.upload'
import { Event } from './event'


export const App = () => {
  return (
    <Router>
      <Auth path='/auth' />
      <Dashboard path='/dashboard' />
      <Upload path='/upload' />
      <Event path='/event' />
    </Router>
  )
}