import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STUI } from '../../stores/app.store'
import { STAdmin, STTab } from '../../stores/admin.store'

import sty from '../../styles/modules/admin.module.css'

import { Header } from './header.admin'
import { Messages } from './messages.admin'
import { Shares } from './shares.admin'


const UISwap = (props) => {
    const SSTab = useSnapshot(STTab)
    return props.children.filter(c => c.props.uiName === SSTab.name)
}


export const Admin = ({ ws, core }) => {
    const SSAdmin = useSnapshot(STAdmin)


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STUI.name = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        (core.isPresenter || SSAdmin.privileged) &&
        <div className={sty.pageView}>
            <Header ws={ws} core={core} />
            <UISwap>
                <Messages ws={ws} uiName={'Messages'} />
                <Shares ws={ws} uiName={'Shares'} />
            </UISwap>
        </div>
    )
}