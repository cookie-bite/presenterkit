import { useEffect } from 'react'
import { Route } from '../../components/core.cmp'
import { Auth } from './auth.acc'
import { Dashboard } from './dashboard.acc'


export const Account = () => {
    console.log('account')
    
    useEffect(() => {
        window.history.pushState({}, '', '/auth')
        // const navigationEvent = new PopStateEvent("navigate")
        // window.dispatchEvent(navigationEvent)
    }, [])


    return (
        <>
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/auth' component={Auth} />
        </>
    )
}