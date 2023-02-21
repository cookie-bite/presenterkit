import { Controls } from 'react-three-gui'
import { Scene } from './components/core.sc'
import { Input } from './components/input.sc'

const core = {}
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const ws = new WebSocket(`ws://${window.location.hostname}:3001`)


export const App = () => {
    return (
        <Controls.Provider>
            <Controls.Canvas shadows>
                <Scene ws={ws} core={core}/>
            </Controls.Canvas>
            {/* <Controls title='Settings' /> */}
            <Input ws={ws} core={core}/>
        </Controls.Provider>
    )
}