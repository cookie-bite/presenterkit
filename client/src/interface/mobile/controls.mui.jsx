import { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


var delay = null
const timeout = 1500

export const Controls = ({ ws }) => {
    const appSnap = useSnapshot(STApp)

    const textareaRef = useRef()

    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)


    const send = () => {
        if (text.trim() !== '') {
            let temp = text
            while (temp.includes('\n\n')) temp = temp.replace('\n\n', '\n')
            ws.send(JSON.stringify({ command: 'APR_REQ', room: STApp.adminRoom, userID: appSnap.userID, username: appSnap.username, quest: { label: temp, color: appSnap.userColor } }))
            textareaRef.current.style.height = 'inherit'
            setText('')
        }
    }

    const typing = (e) => {
        if (e.target.value.length < 141) setText(e.target.value)
        textareaRef.current.style.height = 'inherit'
        textareaRef.current.style.height = e.target.scrollHeight < 103 ? `${e.target.scrollHeight}px` : '102px'
        textareaRef.current.style.padding = e.target.scrollHeight < 103 ? '5px 15px' : '5px 0 5px 15px'

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


    return (
        <div className={sty.controls}>
            {appSnap.activeSlide.hasOwnProperty('index') && <div className={sty.controlsLiveBtn} onClick={() => { STApp.uiName = 'Slides'; STApp.showTheatre = true }}>
                <Icon name='tv' size={18} color='--white' />
            </div>}
            <button className={sty.controlsMenuBtn} style={{ opacity: appSnap.uiName === 'Menu' ? 0 : 1 }} onClick={() => STApp.uiName = 'Menu'}>
                <Icon name='ellipsis-horizontal-circle' size={30} color='--system-blue' />
            </button>
            <textarea className={sty.controlsInput} rows={1} maxLength={140} type='text' name='text' autoComplete='off' placeholder='Type a question...' value={text}
                ref={textareaRef}
                onChange={(e) => typing(e)}
            />
            {text && <button className={sty.controlsInputBtn} onClick={() => send()}>
                <Icon name='arrow-up-circle-o' size={35} color='--system-blue' />
            </button>}
        </div>
    )
}