import { Controls } from 'react-three-gui'
import { Scene } from './components/core.sc'
import { Input } from './components/input.sc'
import { useSnapshot } from 'valtio'
import { STApp } from './stores/app.store'

const core = {}
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const ws = new WebSocket(`ws://${window.location.hostname}:3001`)

const UISwap = (props) => {
    const appSnap = useSnapshot(STApp)
    return props.children.filter(c => c.props.uiName === appSnap.uiName)
}


export const App = () => {
    return (
        <UISwap>
            <Controls.Provider uiName={'Board'}>
                <Controls.Canvas shadows>
                    <Scene ws={ws} core={core} />
                </Controls.Canvas>
                {/* <Controls title='Settings' /> */}
            </Controls.Provider>
            <Input ws={ws} core={core} uiName={'Input'}/>
        </UISwap>
        // <>
        //     <Controls.Provider>
        //         <Controls.Canvas shadows>
        //             <Scene ws={ws} core={core} />
        //         </Controls.Canvas>
        //         {/* <Controls title='Settings' /> */}
        //     </Controls.Provider>
        //     <Input ws={ws} core={core} />
        // </>
    )
}