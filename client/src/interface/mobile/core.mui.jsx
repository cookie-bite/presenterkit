import { AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'

import { Entry } from './entry.mui'
import { Controls } from './controls.mui'
import { Quests } from './quests.mui'
import { Shares } from './shares.mui'
import { Slides } from './slides.mui'


export const Mobile = ({ ws, core }) => {
    const appSnap = useSnapshot(STApp)


    return (
        <>
            <AnimatePresence mode='wait'>
                {appSnap.showEntry && <Entry ws={ws} core={core} />}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {!appSnap.showEntry && <>
                    <Controls ws={ws} core={core} />
                    <Quests />
                    <Shares />
                    <Slides />
                </>}
            </AnimatePresence>
        </>
    )
}