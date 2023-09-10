import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STAdmin, STApp } from '../../stores/app.store'

import sty from '../../styles/modules/admin.module.css'

import { Header } from './header.admin'
import { Messages } from './messages.admin'
import { Shares } from './shares.admin'


const UISwap = (props) => {
    const adminSnap = useSnapshot(STAdmin)
    return props.children.filter(c => c.props.uiName === adminSnap.uiName)
}


export const Admin = ({ ws, core }) => {
    const adminSnap = useSnapshot(STAdmin)


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        (core.isPresenter || adminSnap.isAdmin) &&
        <div className={sty.pageView}>
            <Header ws={ws} />
            <UISwap>
                <Messages ws={ws} uiName={'Messages'} />
                <Shares ws={ws} uiName={'Shares'} />
            </UISwap>
        </div>
    )
}