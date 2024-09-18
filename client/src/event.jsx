import { useEffect } from 'react'

import { STApp, STEvent } from './stores/app.store'

import { Scene } from './scene/core.scn'
import { Desktop } from './interface/desktop/core.dui'
import { Mobile } from './interface/mobile/core.mui'
import { initWS, ws } from './ws'


const core = {
    openingText: 'Welcome to Event',
    isMobile: 'ontouchend' in document,
    isDev: process.env.NODE_ENV === 'development'
}


window.addEventListener('resize', () => {
    if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) STApp.isFullscreen = true
    else STApp.isFullscreen = false
})



export const Event = () => {
    initWS()


    useEffect(() => {
        const params = new URL(window.location.toString()).searchParams
        if (!STEvent.id && params.get('id')) STEvent.id = params.get('id')
        return () => ws.close()
    }, [])


    return (
        <>
            <Scene ws={ws} core={core} />
            {!core.isMobile && <Desktop ws={ws} core={core} />}
            {core.isMobile && <Mobile ws={ws} core={core} />}
        </>
    )
}