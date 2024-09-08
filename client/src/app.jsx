import { useEffect } from 'react'
import { STRoute } from './stores/app.store'

import { goTo, Route } from './components/core.cmp'
import { Board } from './interface/account/board.acc'
import { Auth } from './interface/account/auth.acc'
import { Event } from './event'
import { useSnapshot } from 'valtio'


export const App = () => {
    const SSRoute = useSnapshot(STRoute)
    

    useEffect(() => {
        const params = new URL(window.location.toString()).searchParams
        for (let param of params.keys()) {
            STRoute.params[param] = params.get(param)
        }
        console.log(STRoute.params)
    }, [SSRoute.path])
    
    
    useEffect(() => {
        if (STRoute.path !== '/event') {
            const path = localStorage.getItem('SIGNED_IN') ? '/board' : '/auth'
            goTo(path)
        }
    }, [])


    return (
        <>
            <Route path='/board' component={Board} />
            <Route path='/auth' component={Auth} />
            <Route path='/event' component={Event} />
        </>
    )
}