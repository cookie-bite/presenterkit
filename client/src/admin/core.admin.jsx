import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STAdmin } from '../stores/app.store'
import sty from '../styles/admin.module.css'

import { Header } from './header.admin'
import { Share } from './share.admin'
import { Display } from './display.admin'
import { Queue } from './queue.admin'


const UISwap = (props) => {
    const adminSnap = useSnapshot(STAdmin)
    return props.children.filter(c => c.props.uiName === adminSnap.uiName)
}


export const Admin = ({ ws }) => {
    const appSnap = useSnapshot(STApp)

    const joinRoom = (room) => {
        setTimeout(() => ws.send(JSON.stringify({ command: 'JOIN_ADRM', room })), 500)
    }

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data)
        console.log(data)

        if (data.command === 'INIT_ADMIN') {
            STAdmin.queue = data.queue
            STAdmin.display = data.display
            STAdmin.config.forwarding = data.config.forwarding
        } else if (data.command === 'APR_REQ') {
            STAdmin.queue.push({
                userID: data.quest.userID,
                author: data.quest.author,
                label: data.quest.label
            })
        } else if (data.command === 'DISP_LBL') {
            STAdmin.display = data.display
        } else if (data.command === 'UPDT_CNFG') {
            STAdmin.config[data.name] = data.updateTo
        }
    }


    useEffect(() => joinRoom(STApp.adminRoom), [])


    return (
        appSnap.uiName === 'Admin' && 
        <div className={sty.pageView}>
            <Header />
            <UISwap>
                <Queue ws={ws} uiName={'Queue'} />
                <Display ws={ws} uiName={'Display'} />
                <Share ws={ws} uiName={'Share'} />
            </UISwap>
        </div>
    )
}