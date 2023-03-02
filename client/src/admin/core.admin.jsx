import { useEffect, useState } from 'react'
import { STApp } from '../stores/app.store'
import sty from '../styles/admin.module.css'


export const Admin = ({ ws, core }) => {
    const [quests, setQuests] = useState([])

    const joinRoom = (room) => {
        ws.send(JSON.stringify({ command: 'JOIN_ROOM', room }))
    }

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data)
        console.log(data)

        if (data.command === 'NEW_MSG') setQuests([...quests, { userID: data.user.id, author: data.message.username, label: data.message.label }])
    }

    const Quest = ({ data, index }) => {
        const send = () => {
            ws.send(JSON.stringify({ command: 'NEW_MSG', room: STApp.userRoom, userID: data.userID, username: data.author, quest: { label: data.label } }))
        }

        const close = () => {
            console.log('hellou')
        }

        return (
            <div className={sty.questView}>
                <div className={sty.questBody}>
                    <h6 className={sty.questAuthor}>{data.author}</h6>
                    <h3 className={sty.questLabel}>{data.label}</h3>
                </div>
                <div className={sty.questBtn}>
                    <button className={sty.button} style={{ backgroundColor: 'var(--system-blue)' }} onClick={() => send()}>
                        <img className={sty.buttonIcon} src="/icons/arrow-up.svg" />
                    </button>
                    <button className={sty.button} style={{ backgroundColor: 'var(--system-red)', marginLeft: 10}} onClick={() => close()}>
                        <img className={sty.buttonIcon} src="/icons/close.svg" />
                    </button>
                </div>
            </div>
        )
    }

    useEffect(() => {
        joinRoom(STApp.adminRoom)
    }, [])



    // const sty = {
    //     pageView: {
    //         display: 'flex',
    //     },
    //     headerView: {

    //     },
    //     header: {
    //         color: 'var(--primary-label)',
    //     },
    //     questAuthor: {
    //         color: 'var(--primary-label)',
    //     },
    //     questLabel: {
    //         color: 'var(--primary-label)',
    //     },
    // }

    return (
        <div className={sty.pageView}>
            <div className={sty.headerView}>
                <h1 className={sty.header}>Admin Panel</h1>
            </div>
            <div className={sty.questList}>
                {quests.map((quest, index) => { return <Quest index data={quest} /> })}
            </div>
        </div>
    )
}