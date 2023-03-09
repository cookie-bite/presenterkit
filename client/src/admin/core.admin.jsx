import { useEffect } from 'react'
import { proxy, snapshot, useSnapshot } from 'valtio'
import { STApp } from '../stores/app.store'
import sty from '../styles/admin.module.css'


export const Admin = ({ ws, core }) => {
    const state = proxy({
        display: { quest: core.openingText, author: '' },
        text: '',
        queue: []
    })

    const joinRoom = (room) => {
        ws.send(JSON.stringify({ command: 'JOIN_ADRM', room }))
    }

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data)
        console.log(data)

        if (data.command === 'INIT_WS') {
            state.queue = data.queue
            state.display = data.display
        } else if (data.command === 'APR_REQ') {
            state.queue.push({
                userID: data.quest.userID,
                author: data.quest.author,
                label: data.quest.label
            })
        } else if (data.command === 'DISP_LBL') {
            state.display = data.display
        }
    }


    useEffect(() => {
        joinRoom(STApp.adminRoom)
    }, [])


    const Display = () => {
        const stateSnap = useSnapshot(state)

        const send = () => {
            if (state.text.trim() !==  ''){
                state.display = { quest: state.text, author: '' }
                ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: state.display }))
                state.text = ''
            }
        }

        return (
            <div className={sty.displayView}>
                <h5 className={sty.displayAuthor}>{stateSnap.display.author}</h5>
                <h2 className={sty.displayLabel}>{stateSnap.display.quest}</h2>
                <div className={sty.displayBottom}>
                    <input className={sty.displayInput} type='text' name='text' autoComplete='off' placeholder='Type a question...' value={stateSnap.text}
                        onChange={(e) => state.text = e.target.value}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }}
                    />
                    <button className={sty.button} style={{ backgroundColor: 'var(--system-green)' }} onClick={() => send()}>
                        <img className={sty.buttonIcon} src={'/icons/arrow-up.svg'} />
                    </button>
                </div>
            </div>
        )
    }

    const Quest = ({ data, index }) => {

        const aprReq = (act) => {
            ws.send(JSON.stringify({ command: 'SEND_USER', room: STApp.userRoom, userID: data.userID, username: data.author, aprReq: act, quest: { label: data.label, index } }))
            state.queue.splice(index, 1)
        }

        return (
            <div className={sty.questView} style={{ backgroundColor: `${index % 2 === 0 ? 'var(--secondary-sb)' : 'var(--quarternary-sb)'}` }}>
                <div className={sty.questBody}>
                    <h6 className={sty.questAuthor}>{data.author}</h6>
                    <h3 className={sty.questLabel}>{data.label}</h3>
                </div>
                <div className={sty.questBtn}>
                    <button className={sty.button} style={{ marginRight: 10 }} onClick={() => aprReq(true)}>
                        <img className={sty.buttonIcon} src="/icons/arrow-up.svg" />
                    </button>
                    <button className={sty.button} style={{ backgroundColor: 'var(--system-red)', marginLeft: 5 }} onClick={() => aprReq(false)}>
                        <img className={sty.buttonIcon} src="/icons/close.svg" />
                    </button>
                </div>
            </div>
        )
    }

    const Queue = () => {
        const stateSnap = useSnapshot(state)

        return (
            <div className={sty.questList}>
                {stateSnap.queue.map((quest, index) => { return <Quest index={index} data={quest} /> })}
            </div>
        )
    }


    return (
        <div className={sty.pageView}>
            <div className={sty.headerView}>
                <h1 className={sty.header}>Admin Panel</h1>
            </div>
            <Display />
            <Queue />
        </div>
    )
}