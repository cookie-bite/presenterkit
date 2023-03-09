import { Controls } from 'react-three-gui'
import { useSnapshot } from 'valtio'
import { STApp } from './stores/app.store'

import { Scene } from './components/core.sc'
import { Input } from './components/input.sc'
import { Admin } from './admin/core.admin'


const core = { openingText: 'Welcome to WWDC23' }
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const boardWS = new WebSocket(`ws://${window.location.hostname}:3001`)
const adminWS = new WebSocket(`ws://${window.location.hostname}:3001`)

const UISwap = (props) => {
    const appSnap = useSnapshot(STApp)
    return props.children.filter(c => c.props.uiName === appSnap.uiName)
}


export const App = () => {
    return (
        <UISwap>
            <Controls.Provider uiName={'Board'}>
                <Controls.Canvas shadows>
                    <Scene ws={boardWS} core={core} />
                </Controls.Canvas>
                {/* <Controls title='Settings' /> */}
            </Controls.Provider>
            <Input ws={boardWS} core={core} uiName={'Board'} />
            <Admin ws={adminWS} core={core} uiName={'Admin'} />
        </UISwap>
    )
}