import { Controls } from 'react-three-gui'
import { Scene } from './components/core.sc'
import { Input } from './components/input.sc'


export const App = () => {
    return (
        <Controls.Provider>
            <Controls.Canvas shadows>
                <Scene />
            </Controls.Canvas>
            {/* <Controls title='Settings' /> */}
            <Input />
        </Controls.Provider>
    )
}