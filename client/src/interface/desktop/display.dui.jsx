import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { STDisplay, STEvent } from '../../stores/app.store'
import { RTAuth, RTDisplay } from '../../routes/routes'

import sty from '../../styles/modules/desktop.module.css'


export const Display = () => {
    const SSDisplay = useSnapshot(STDisplay)
    const SSEvent = useSnapshot(STEvent)

    const init = () => {
        RTDisplay.init(STEvent.id, STDisplay.id).then((data) => {
            console.log('Display UI', data)
            if (data.success) {
                // Object.assign(STDisplay, data.display)
                
                STDisplay.label = data.display.label
                STDisplay.slide = data.display.slide

                const interval = setInterval(async () => {
                    if (window.ws.readyState === 1) {
                        clearInterval(interval)

                        if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

                        window.ws.send(JSON.stringify({
                            command: 'JOIN_ROOM',
                            eventID: STEvent.id ? STEvent.id : localStorage.getItem('eventID'),
                            userID: localStorage.getItem('userID'),
                            displayID: STDisplay.id,
                            token: localStorage.getItem('ACS_TKN')
                        }))
                    }
                }, 10)
            }
        })
    }

    useEffect(() => {
        init()
    }, [])

    console.log('Display UI [slide name]', SSDisplay.slide)

    return (
        <div className={sty.display}>
            {SSDisplay.slide.name && <>
                <img className={sty.displayBgImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSDisplay.slide.name}/${SSDisplay.slide.page}.webp`} alt={`Page ${SSDisplay.slide.page}`} />
                <img className={sty.displayImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSDisplay.slide.name}/${SSDisplay.slide.page}.webp`} alt={`Page ${SSDisplay.slide.page}`} />
            </>}
        </div>
    )
}