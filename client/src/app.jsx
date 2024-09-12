import { Router } from './components/core.cmp'
import { Dashboard } from './interface/account/dashboard.acc'
import { Auth } from './interface/account/auth.acc'
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