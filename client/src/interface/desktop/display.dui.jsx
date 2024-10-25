import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { STDisplay, STEvent, STSlide, STSlides } from '../../stores/app.store'
import { RTAuth, RTDisplay } from '../../routes/routes'

import sty from '../../styles/modules/desktop.module.css'


export const Display = () => {
    const SSDisplay = useSnapshot(STDisplay)
    const SSEvent = useSnapshot(STEvent)
    const SSSlide = useSnapshot(STSlide)
    const SSSlides = useSnapshot(STSlides)

    const init = () => {
        RTDisplay.init(STEvent.id, STDisplay.id).then((data) => {
            console.log('Display [init]', data)
            if (data.success) {


                const interval = setInterval(async () => {
                    if (window.ws.readyState === 1) {
                        clearInterval(interval)

                        if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

                        console.log('Display [interval]', STSlide, STSlides)

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

    console.log(STSlides.list, STSlide)

    return (
        <div className={sty.display}>
            {SSSlides.list[SSSlide.active.index]?.name && <>
                <img className={sty.displayBgImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} alt={`Page ${1}`} />
                <img className={sty.displayImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} alt={`Page ${1}`} />
            </>}
        </div>
    )
}