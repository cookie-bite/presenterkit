import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { STHost, STUI, STEntry } from '../stores/app.store'
import { STDisplay } from '../stores/scene.store'


import { CamCon } from './camcon.scn'
import { Env } from './env.scn'
import { Lights } from './lights.scn'
import { Display } from './display.scn'
import { Users } from './users.scn'


export const Scene = ({ ws, core }) => {

    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.altKey && e.code.slice(3) === 'N') {
                window.open(`http://${STHost.ip}:${STHost.port1}`, '_blank')
            }

            if (STEntry.show) return

            if (e.key === 'Escape' && STUI.name === '') {
                Object.assign(STDisplay, { quest: core.openingText, author: '' })
                ws.send(JSON.stringify({ command: 'DISP_LBL', room: [core.userRoom, core.adminRoom], display: STDisplay }))
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