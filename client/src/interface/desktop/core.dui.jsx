import { useSnapshot } from 'valtio'
import { STDesktop, STApp } from '../../stores/app.store'

import { Entry } from './entry.dui'
import { QRScreen } from './qr.dui'
import { Users } from './users.dui'
import { Quests } from './quests.dui'
import { Presenter } from './presenter.dui'
import { Slides } from './slides.dui'
import { Admin } from '../admin/core.admin'
import { Controls } from './controls.dui'
import { AnimatePresence } from 'framer-motion'


export const Desktop = ({ ws, core }) => {
    const desktopSnap = useSnapshot(STDesktop)
    const appSnap = useSnapshot(STApp)


    return (
        <>
            <AnimatePresence mode='wait'>
                {appSnap.showEntry && <Entry ws={ws} core={core} />}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {!appSnap.showEntry && <>
                    {appSnap.uiName === 'QRScreen' && <QRScreen />}
                    <Users ws={ws} />
                    <Quests ws={ws} core={core} />
                    {appSnap.uiName === 'Slides' && <Slides />}
                    {appSnap.uiName === 'Presenter' && <Presenter ws={ws} />}
                    {appSnap.uiName === 'Admin' && !core.isMobile && <Admin ws={ws} core={core} />}
                    {desktopSnap.controls.isActive && <Controls core={core} />}
                </>
                }
            </AnimatePresence>

        </>
    )
}