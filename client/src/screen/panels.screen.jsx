import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STScene, STScreen, STUI } from '../stores/app.store'
import { genColor } from '../utilities/core.utils'

import sty from '../styles/screen.module.css'


const Panel = ({ children, label, count }) => {
    const screenSnap = useSnapshot(STScreen)


    const changePos = () => {
        STScreen.panel.position = screenSnap.panel.position === 'right' ? 'left' : 'right'
        localStorage.setItem('PANEL_POS', screenSnap.panel.position === 'right' ? 'left' : 'right')
    }


    return (
        <div className={sty.panelView} style={{ [screenSnap.panel.position]: 20 }}>
            <div className={sty.panelHeader}>
                <div className={sty.panelLblView}>
                    {count !== 0 && <div className={sty.panelCountBg}>
                        <h1 className={sty.panelCountLbl}>{count}</h1>
                    </div>}
                    <h1 className={sty.panelLbl}>{label}</h1>
                </div>
                <div className={sty.panelBtns}>
                    <button className={sty.panelBtn} onClick={() => changePos()}>
                        <img className={sty.panelBtnIc} style={{ transform: `rotate(${screenSnap.panel.position === 'right' ? '0' : '0.5turn'})` }} src={'/icons/caret.svg'} />
                    </button>
                    <button className={sty.panelBtn} style={{ marginLeft: 10 }} onClick={() => STScreen.uiName = ''}>
                        <img className={sty.panelBtnIc} src={'/icons/close.svg'} />
                    </button>
                </div>
            </div>
            {children}
        </div>
    )
}


var delay = null
const timeout = 1500

const Input = ({ ws }) => {
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


const QuestsPanel = ({ ws }) => {
    const sceneSnap = useSnapshot(STScene)


    const setDisplay = (quest, index) => {
        STScene.display = { quest: quest.label, author: quest.username }
        STScene.quests[index].effect = false
        ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STScene.display, index }))
    }


    return (
        <Panel label={'Questions'} count={sceneSnap.quests.length}>
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
                : <div className={sty.questListEmpty}>
                    <h3 className={sty.questListEmptyTtl}>No One Asked Yet</h3>
                    <h5 className={sty.questListEmptySbtl} onClick={() => closeModal()}>Never afraid of being the first one.</h5>
                </div>
            }
            <Input ws={ws} />
        </Panel>
    )
}


const UsersPanel = () => {
    const appSnap = useSnapshot(STApp)


    return (
        <Panel label={'Users'} count={appSnap.roomActivity.userList.length}>
            <div className={sty.userList}>
                {appSnap.roomActivity.userList.map((user, index) => {
                    let color = genColor()

                    return (
                        <div className={sty.userListItem} key={index}>
                            <div className={sty.userListItemAvatarView} style={{ background: `linear-gradient(45deg, ${color}24, ${color}2B)` }}>
                                <h1 className={sty.userListItemAvatarLbl} style={{ color }}>{user.charAt()}</h1>
                            </div>
                            <div className={sty.userListItemLblView}>
                                <h2 className={sty.userListItemLbl}>{user}</h2>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={sty.userInfo}>
                <div className={sty.userInfoIcView}>
                    <img className={sty.userInfoIc} src={`/icons/${appSnap.roomActivity.activity === 'joined' ? 'enter' : 'exit'}-oc.svg`} />
                </div>
                <h5 className={sty.userInfoLbl}>{`${appSnap.roomActivity.user.id === appSnap.userID ? 'You' : appSnap.roomActivity.user.name} ${appSnap.roomActivity.activity}`}</h5>
            </div>
        </Panel>
    )
}


const UISwap = (props) => {
    const screenSnap = useSnapshot(STScreen)
    return props.children.filter(c => c.props.uiName === screenSnap.uiName)
}


export const Panels = ({ ws }) => {
    return (
        <UISwap>
            <QuestsPanel uiName={'QuestsPanel'} ws={ws} />
            <UsersPanel uiName={'UsersPanel'} />
        </UISwap>
    )
}