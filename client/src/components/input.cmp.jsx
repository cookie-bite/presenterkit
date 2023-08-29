import { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { genColor, genQuest } from '../utilities/core.utils'
import { STApp } from '../stores/app.store'
import { Icon } from './core.cmp'

import sty from '../styles/modules/desktop.module.css'


var delay = null
const timeout = 1500

export const Input = ({ innerRef, ws, core }) => {
    const appSnap = useSnapshot(STApp)

    const textareaRef = innerRef ? innerRef : useRef()

    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)


    const send = () => {
        if (text.trim() !== '') {
            if (core.isPresenter && /^\d+$/.test(text)) {
                for (let i = 0; i < +text; i++) {
                    let quest = genQuest('long')
                    setTimeout(() => ws.send(JSON.stringify({ command: 'APR_REQ', room: STApp.adminRoom, userID: appSnap.userID, ...quest })), 1000 * i)
                }
            } else {
                let temp = text
                while (temp.includes('\n\n')) temp = temp.replace('\n\n', '\n')
                ws.send(JSON.stringify({ command: 'APR_REQ', room: STApp.adminRoom, userID: appSnap.userID, username: appSnap.username, quest: { label: temp, color: appSnap.userColor } }))
            }
            textareaRef.current.style.height = 'inherit'
            setText('')
        }
    }

    const typing = (e) => {
        if (e.target.value.length < 141 && textareaRef.current.pass) {
            setText(e.target.value)
            textareaRef.current.style.height = 'inherit'
            textareaRef.current.style.height = e.target.scrollHeight < 83 ? `${e.target.scrollHeight}px` : '82px'
            textareaRef.current.style.padding = e.target.scrollHeight < 83 ? '5px 15px' : '5px 0 5px 15px'
        }

        if (!isTyping) {
            ws.send(JSON.stringify({ command: 'SEND_TYP', room: STApp.userRoom, isTyping: true, color: appSnap.userColor, userID: appSnap.userID, username: appSnap.username }))
            setIsTyping(true)
        }

        clearTimeout(delay)
        delay = setTimeout(() => {
            setIsTyping(false)
            ws.send(JSON.stringify({ command: 'SEND_TYP', room: STApp.userRoom, isTyping: false, color: appSnap.userColor, userID: appSnap.userID, username: appSnap.username }))
        }, timeout)
    }

    const onKeyDown = (e) => {
        if (!e.shiftKey && e.code === 'Enter') {
            textareaRef.current.pass = ''
            send()
        } else if (!textareaRef.current.pass) {
            textareaRef.current.pass = 'true'
        }
    }


    return (
        <div className={sty.inputView}>
            <div className={sty.msgColor} style={{ backgroundColor: appSnap.userColor }} onClick={() => STApp.userColor = genColor()}></div>
            <textarea className={sty.input} value={text} rows={1} maxLength={140} type='text' name='text' autoComplete='off' placeholder='Type a question...' pass='true'
                ref={textareaRef}
                onChange={(e) => typing(e)}
                onKeyDown={(e) => onKeyDown(e)}
            />
            {text && <button className={sty.inputBtn} onClick={() => send()}>
                <Icon name='arrow-up-circle-o' size={30} color='--system-blue' />
            </button>}
        </div>
    )
}