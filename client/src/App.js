import { Controls } from 'react-three-gui'
import { Scene } from './components/core.sc'
import { Input } from './components/input.sc'


const ws = new WebSocket(`ws://${window.location.hostname}:3001`)


export const App = () => {
    return (
        <Controls.Provider>
            <Controls.Canvas shadows>
                <Scene ws={ws} />
            </Controls.Canvas>
            {/* <Controls title='Settings' /> */}
            <Input ws={ws} />
        </Controls.Provider>
    )
}