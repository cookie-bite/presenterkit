import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'

import { Entry } from './entry.mui'
import { Controls } from './controls.mui'
import { Menu } from './menu.mui'
import { Quests } from './quests.mui'
import { Shares } from './shares.mui'
import { Slides } from './slides.mui'


export const Mobile = ({ ws, core }) => {
    const appSnap = useSnapshot(STApp)


    return (
        <>
            {appSnap.showEntry
                ? <Entry ws={ws} core={core} />
                : <>
                    <Controls ws={ws} core={core} />
                    {appSnap.uiName === 'Menu' && <Menu ws={ws} />}
                    {appSnap.uiName === 'Quests' && <Quests />}
                    {appSnap.uiName === 'Shares' && <Shares />}
                    {appSnap.uiName === 'Slides' && <Slides />}
                </>
            }
        </>
    )
}