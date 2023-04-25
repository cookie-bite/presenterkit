import { useSnapshot } from 'valtio'
import { STScreen } from '../stores/app.store'

import { QRScreen } from './qr.screen'
import { Controls } from './controls.screen'
import { Panels } from './panels.screen'


export const Screen = ({ ws }) => {
    const screenSnap = useSnapshot(STScreen)


    return ( 
        screenSnap.controls.isActive && <>
            <Controls />
            {screenSnap.uiName === 'QRScreen' && <QRScreen />}
            <Panels ws={ws} />
        </>
    )
}