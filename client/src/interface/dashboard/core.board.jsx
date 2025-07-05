import { useSnapshot } from 'valtio'

import { Menu } from './menu.board'
import { Events } from './events.board'
import { Payments } from './payments.board'

import { STBoardUI } from '../../stores/app.store'

import sty from '../../styles/modules/dashboard.module.css'


const UISwap = (props) => {
  const SSBoardUI = useSnapshot(STBoardUI)
  return props.children.filter(c => c.props.uiName === SSBoardUI.name)
}


export const Dashboard = () => {

  return (
    <div className={sty.dashboard}>
      <Menu />

      <UISwap>
        <Events uiName={'Events'} />
        <Payments uiName={'Payments'} />
      </UISwap>
    </div>
  )
}