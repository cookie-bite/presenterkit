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

        if (data.command === 'NEW_MSG') setQuests([...quests, { author: data.message.username, label: data.message.label }])
    }

    const Quest = ({ data }) => {
        const send = () => {
            console.log('click')
        }

        return (
            <div className={sty.questView}>
                <div className={sty.questBody}>
                    <h2 className={sty.questAuthor}>{data.author}</h2>
                    <p className={sty.questLabel}>{data.label}</p>
                </div>
                <div className={sty.questBtn}>
                    <button className={sty.sendButton} onClick={() => send()}>
                        <img className={sty.sendButtonIcon} src="/icons/arrow-up.svg" />
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
                {quests.map((quest) => { return <Quest data={quest} /> })}
            </div>
        </div>
    )
}