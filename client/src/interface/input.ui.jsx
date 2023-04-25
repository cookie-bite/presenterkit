import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STUI } from '../stores/app.store'
import sty from '../styles/ui.module.css'

var delay = null
const timeout = 1500

export const Input = ({ ws }) => {
    const appSnap = useSnapshot(STApp)
    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)


    const send = () => {
        if (text.trim() !== '') {
            ws.send(JSON.stringify({ command: 'APR_REQ', room: STApp.adminRoom, userID: appSnap.userID, username: appSnap.username, quest: { label: text } }))
            setText('')
        }
    }

    const typing = (e) => {
        setText(e.target.value)

        if (!isTyping) {
            ws.send(JSON.stringify({ command: 'SEND_TYP', room: STApp.userRoom, isTyping: true, color: appSnap.indColor, userID: appSnap.userID, username: appSnap.username }))
            setIsTyping(true)
        }

        clearTimeout(delay)
        delay = setTimeout(() => {
            setIsTyping(false)
            ws.send(JSON.stringify({ command: 'SEND_TYP', room: STApp.userRoom, isTyping: false, color: appSnap.indColor, userID: appSnap.userID, username: appSnap.username }))
        }, timeout)
    }


    return (
        <div className={sty.inputView}>
            <input className={sty.input} type='text' name='text' autoComplete='off' placeholder='Type a question...' value={text}
                onChange={(e) => typing(e)}
                onFocus={() => STUI.menu.isActive = false}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send() }}
            />
            {text && <button className={sty.inputBtn} onClick={() => send()}>
                <img className={sty.inputBtnIc} src={'/icons/arrow-up-circle-oc.svg'} />
            </button>}
        </div>
    )
}