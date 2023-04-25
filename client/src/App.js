import { Scene } from './scene/core.sc'
import { Screen } from './screen/core.screen'
import { Admin } from './admin/core.admin'
import { Interface } from './interface/core.ui'

import './styles/index.css'


const core = { openingText: 'Welcome to WWDC23' }
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const boardWS = new WebSocket(`ws://${window.location.hostname}:3001`)
const adminWS = new WebSocket(`ws://${window.location.hostname}:3001`)


export const App = () => {
    return (
        <>
            <Scene uiName={'Board'} ws={boardWS} core={core} />
            {!core.isMobile && <Screen ws={boardWS} />}
            {!core.isMobile && <Admin ws={adminWS} core={core} uiName={'Admin'} />}
            {core.isMobile && <Interface ws={boardWS} core={core} uiName={'Board'} />}
        </>
    )
}