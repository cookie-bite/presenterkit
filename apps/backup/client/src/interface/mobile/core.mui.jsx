import { AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STEntry } from '../../stores/app.store'

import { Entry } from './entry.mui'
import { Controls } from './controls.mui'
import { Quests } from './quests.mui'
import { Shares } from './shares.mui'
import { Slides } from './slides.mui'


export const Mobile = ({ core }) => {
  const SSEntry = useSnapshot(STEntry)


  return (
    <>
      <AnimatePresence mode='wait'>
        {SSEntry.show && <Entry core={core} />}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {!SSEntry.show && <>
          <Controls core={core} />
          <Quests />
          <Shares />
          <Slides />
        </>}
      </AnimatePresence>
    </>
  )
}