import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { STUI, STEntry, STEvent, STUser } from '../stores/app.store'
import { STDisplay } from '../stores/scene.store'


import { CamCon } from './camcon.scn'
import { Env } from './env.scn'
import { Lights } from './lights.scn'
import { Display } from './display.scn'
import { Users } from './users.scn'


export const Scene = ({ ws, core }) => {

    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.altKey && e.code.slice(3) === 'N') window.open(process.env.REACT_APP_HOST_URL, '_blank')

            if (STEntry.show) return

            if (e.key === 'Escape' && STUI.name === '' && STUser.isPresenter) {
                Object.assign(STDisplay, { quest: core.openingText, author: '' })
                ws.send(JSON.stringify({ command: 'DISP_LBL', eventID: STEvent.id, display: STDisplay }))
            }
        }

        window.addEventListener('keyup', onKeyUp)

        return () => { window.removeEventListener('keyup', onKeyUp) }
    }, [])


    return (
        <Canvas shadows>
            <CamCon core={core} />
            <Lights />
            <Env />
            <Display core={core} />
            <Users />
            {false && <Stats />}
        </Canvas>
    )
}