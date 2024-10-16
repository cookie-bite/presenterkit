import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { STApp, STEvent } from './stores/app.store'
import { RTEvent } from './routes/routes'

import { Scene } from './scene/core.scn'
import { Desktop } from './interface/desktop/core.dui'
import { Mobile } from './interface/mobile/core.mui'
import { initWS } from './ws'


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
    const SSEvent = useSnapshot(STEvent)

    useEffect(() => {
        const params = new URL(window.location.toString()).searchParams
        if (!STEvent.id && params.get('id')) {
            STEvent.id = params.get('id')

            RTEvent.verify(STEvent.id).then((data) => {
                console.log('RTEvent.verify() data:', data)
                STEvent.showUI = true

                if (data.success) {
                    initWS()
                    STEvent.exists = true
                } else {
                    STEvent.exists = false
                }
            })
        }


        return () => window.ws.close()
    }, [])


    return (
        SSEvent.showUI && (SSEvent.exists
            ? <>
                <Scene core={core} />
                {!core.isMobile && <Desktop core={core} />}
                {core.isMobile && <Mobile core={core} />}
            </>
            : <div>
                <h2>Event does not exist</h2>
            </div>
        )
    )
}