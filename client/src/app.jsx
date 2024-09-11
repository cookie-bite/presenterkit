import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STRoute } from './stores/app.store'

import { goTo, Router } from './components/core.cmp'
import { Board } from './interface/account/board.acc'
import { Auth } from './interface/account/auth.acc'
import { Event } from './event'


export const App = () => {
    const SSRoute = useSnapshot(STRoute)

    
    useEffect(() => {
        const params = new URL(window.location.toString()).searchParams
        for (let param of params.keys()) {
            STRoute.params[param] = params.get(param)
        }
    }, [SSRoute.path])


    useEffect(() => {
        if (STRoute.path !== '/event') {
            const path = localStorage.getItem('SIGNED_IN') ? '/board' : '/auth'
            goTo(path)
        }
    }, [])


    return (
        <Router>
            <Board path='/board' />
            <Auth path='/auth' />
            <Event path='/event' />
        </Router>
    )
}