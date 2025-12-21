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


export const Desktop = ({ core }) => {
  const SSUI = useSnapshot(STUI)
  const SSEntry = useSnapshot(STEntry)


  return (
    <>
      <AnimatePresence mode='wait'>
        {SSEntry.show && <Entry core={core} />}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {!SSEntry.show && <>
          <QRScreen />
          <Users core={core} />
          <Quests core={core} />
          <Slides />
          {SSUI.name === 'Presenter' && <Presenter core={core} />}
          <Admin core={core} />
          <Alert.Container />
          <Controls core={core} />
        </>
        }
      </AnimatePresence>
    </>
  )
}