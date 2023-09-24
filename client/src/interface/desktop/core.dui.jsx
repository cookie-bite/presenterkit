import { AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'

import { Entry } from './entry.dui'
import { QRScreen } from './qr.dui'
import { Users } from './users.dui'
import { Quests } from './quests.dui'
import { Slides } from './slides.dui'
import { Presenter } from './presenter.dui'
import { Admin } from '../admin/core.admin'
import { Alert } from '../../components/core.cmp'
import { Controls } from './controls.dui'


export const Desktop = ({ ws, core }) => {
    const appSnap = useSnapshot(STApp)


    return (
        <>
            <AnimatePresence mode='wait'>
                {appSnap.showEntry && <Entry ws={ws} core={core} />}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {!appSnap.showEntry && <>
                    <QRScreen />
                    <Users ws={ws} />
                    <Quests ws={ws} core={core} />
                    <Slides />
                    {appSnap.uiName === 'Presenter' && <Presenter ws={ws} />}
                    {appSnap.uiName === 'Admin' && !core.isMobile && <Admin ws={ws} core={core} />}
                    <Alert.Container />
                    <Controls core={core} />
                </>
                }
            </AnimatePresence>

        </>
    )
}