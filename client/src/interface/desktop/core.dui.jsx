import { AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STUI, STEntry } from '../../stores/app.store'

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
    const SSUI = useSnapshot(STUI)
    const SSEntry = useSnapshot(STEntry)


    return (
        <>
            <AnimatePresence mode='wait'>
                {SSEntry.show && <Entry ws={ws} core={core} />}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {!SSEntry.show && <>
                    <QRScreen />
                    <Users ws={ws} core={core} />
                    <Quests ws={ws} core={core} />
                    <Slides />
                    {SSUI.name === 'Presenter' && <Presenter ws={ws} core={core} />}
                    <Admin ws={ws} core={core} />
                    <Alert.Container />
                    <Controls core={core} />
                </>
                }
            </AnimatePresence>
        </>
    )
}