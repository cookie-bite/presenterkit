import { useEffect } from 'react'
import { Route } from '../../components/core.cmp'
import { Auth } from './auth.acc'
import { Board } from './board.acc'


export const Account = () => {
    console.log('account')
    
    useEffect(() => {
        window.history.pushState({}, '', '/auth')
        // const navigationEvent = new PopStateEvent("navigate")
        // window.dispatchEvent(navigationEvent)
    }, [])


    return (
        <>
            <Route path='/board' component={Board} />
            <Route path='/auth' component={Auth} />
        </>
    )
}