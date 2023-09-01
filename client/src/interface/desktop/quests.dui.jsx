import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STScene, STApp } from '../../stores/app.store'
import { Panel } from '../../components/core.cmp'
import { genColor, genQuest } from '../../utilities/core.utils'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


var delay = null
const timeout = 1500


export const Quests = ({ ws, core }) => {
    const appSnap = useSnapshot(STApp)
    const sceneSnap = useSnapshot(STScene)

    const inputRef = useRef()

    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)


    const setDisplay = (quest, index) => {
        STScene.display = { quest: quest.label, author: quest.username }
        STScene.quests[index].effect = false
        ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STScene.display, index }))
    }

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
            inputRef.current.style.height = 'inherit'
            setText('')
        }
    }

    const typing = (e) => {
        if (e.target.value.length < 141 && inputRef.current.pass) {
            setText(e.target.value)
            inputRef.current.style.height = 'inherit'
            inputRef.current.style.height = e.target.scrollHeight < 83 ? `${e.target.scrollHeight}px` : '82px'
            inputRef.current.style.padding = e.target.scrollHeight < 83 ? '5px 15px' : '5px 0 5px 15px'
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
            inputRef.current.pass = ''
            send()
        } else if (!inputRef.current.pass) {
            inputRef.current.pass = 'true'
        }
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <Panel label={'Messages'} count={sceneSnap.quests.length}>
            {sceneSnap.quests.length
                ? <div className={sty.questList}>
                    {sceneSnap.quests.map((quest, index) => {
                        return (
                            <div className={sty.questListItem} key={index} onClick={() => setDisplay(quest, index)}>
                                <h3 className={sty.questListItemSbtl}>{quest.username}</h3>
                                <h1 className={sty.questListItemTtl} style={{ color: quest.color, textShadow: quest.effect ? `0 0 10px ${quest.color}` : 'none' }}>{quest.label}</h1>
                            </div>
                        )
                    })}
                </div>
                : <div className={sty.panelEmpty}>
                    <h3 className={sty.panelEmptyTtl}>No One Asked Yet</h3>
                    <h5 className={sty.panelEmptySbtl} onClick={() => inputRef.current.focus()}>Never afraid of being the first.</h5>
                </div>
            }
            <div className={sty.inputView}>
                <div className={sty.msgColor} style={{ backgroundColor: appSnap.userColor }} onClick={() => STApp.userColor = genColor()}></div>
                <textarea className={sty.input} value={text} rows={1} maxLength={140} type='text' name='text' autoComplete='off' placeholder='Type a question...' pass='true'
                    ref={inputRef}
                    onChange={(e) => typing(e)}
                    onKeyDown={(e) => onKeyDown(e)}
                />
                {text && <button className={sty.inputBtn} onClick={() => send()}>
                    <Icon name='arrow-up-circle-o' size={30} color='--primary-tint' />
                </button>}
            </div>
        </Panel>
    )
}