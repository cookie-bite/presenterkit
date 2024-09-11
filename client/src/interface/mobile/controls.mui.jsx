import { useRef, useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp, STUI, STUser, STUserPanel, STUsers, STSlide, STTheatre, STEvent } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'
import { genColor } from '../../utilities/core.utils'

import sty from '../../styles/modules/mobile.module.css'


var delay = null
const timeout = 1500

export const Controls = ({ ws }) => {
    const SSApp = useSnapshot(STApp)
    const SSUI = useSnapshot(STUI)
    const SSUser = useSnapshot(STUser)
    const SSUsers = useSnapshot(STUsers)
    const SSUserPanel = useSnapshot(STUserPanel)
    const SSSlide = useSnapshot(STSlide)


    const inputRef = useRef()

    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [username, setUsername] = useState('')

    const inputHeight = useAnimation()
    const sendBtn = useAnimation()


    const send = () => {
        if (text.trim() !== '') {
            let temp = text
            while (temp.includes('\n\n')) temp = temp.replace('\n\n', '\n')
            ws.send(JSON.stringify({ command: 'SEND_MSG', eventID: STEvent.id, userID: STUser.id, username: STUser.name, quest: { label: temp, color: STUser.color } }))
            sendBtn.start({ scale: 0, marginLeft: '0px' })
            inputHeight.start({ height: '33px', 'min-width': 'calc(100vw - 77px)' })
            setText('')
        }
    }

    const typing = (e) => {
        if (e.target.value.length < 141) {
            setText(e.target.value)
            inputRef.current.style.height = 'inherit'
            let inputStyle = { height: e.target.scrollHeight < 103 ? e.target.scrollHeight : 102 }
            if (e.target.value.length === 1) {
                inputStyle['min-width'] = 'calc(100vw - 122px)'
                inputHeight.start(inputStyle)
                sendBtn.start({ scale: 1 })
            } else if (e.target.value.length > 1) {
                inputHeight.start(inputStyle)
            } else if (!e.target.value) {
                inputStyle['min-width'] = 'calc(100vw - 77px)'
                sendBtn.start({ scale: 0 })
                inputHeight.start(inputStyle)
            }
        }

        if (!isTyping) {
            ws.send(JSON.stringify({ command: 'SEND_TYP', eventID: STEvent.id, isTyping: true, color: STUser.color, userID: STUser.id, username: STUser.name }))
            setIsTyping(true)
        }

        clearTimeout(delay)
        delay = setTimeout(() => {
            setIsTyping(false)
            ws.send(JSON.stringify({ command: 'SEND_TYP', eventID: STEvent.id, isTyping: false, color: STUser.color, userID: STUser.id, username: STUser.name }))
        }, timeout)
    }

    const openScreen = (screen) => {
        STUI.name = screen
    }

    const closeScreen = () => {
        STUI.name = ''
    }

    const resizeWindow = () => {
        if (STApp.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STApp.isFullscreen = !STApp.isFullscreen
    }

    const submitUser = () => {
        if (STUser.name !== username) {
            STUser.name = username
            ws.send(JSON.stringify({ command: 'SET_USER', eventID: STEvent.id, userID: STUser.id, username, roomActivity: 'updated' }))
        }
    }


    useEffect(() => setUsername(STUser.name), [STUser.name])


    return (
        <>
            <motion.div className={sty.controls}
                initial={{ y: 51 }}
                animate={{ y: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.5, delay: 0.8 }}
            >
                <AnimatePresence>
                    {SSSlide.active.hasOwnProperty('index') &&
                        <motion.div className={sty.controlsLiveBtn}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: 'easeInOut', duration: 0.5, delay: 1.3 }}
                            onClick={() => { STUI.name = 'Slides'; STTheatre.show = true }}
                        >
                            <Icon name='tv' size={18} color='--white' />
                        </motion.div>}
                </AnimatePresence>
                <AnimatePresence>
                    {SSUI.name !== 'Menu' && <motion.button className={sty.controlsMenuBtn}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        onClick={() => STUI.name = 'Menu'}
                    >
                        <Icon name='ellipsis-horizontal-circle' size={30} color='--primary-tint' />
                    </motion.button>}
                </AnimatePresence>
                <motion.textarea className={sty.controlsInput} rows={1} maxLength={140} type='text' name='text' autoComplete='off' placeholder='Type a question...' value={text}
                    style={{ color: SSUser.color }}
                    ref={inputRef}
                    animate={inputHeight}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                    onChange={(e) => typing(e)}
                />
                <motion.button className={sty.controlsInputBtn}
                    animate={sendBtn}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                    onClick={() => send()}
                >
                    <Icon name='arrow-up-circle-o' size={35} color='--primary-tint' />
                </motion.button>
            </motion.div>


            <AnimatePresence>
                {SSUI.name === 'Menu' && <>
                    <motion.div className={sty.menuBg}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        onClick={() => closeScreen()}
                    ></motion.div>
                    <motion.div className={sty.menuView}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        style={{ originX: '16px', originY: '100%' }}
                    >
                        <div className={sty.menuTopList}>
                            <div className={sty.menuTopListIcView}>
                                <h5 className={sty.menuTopListInd}>{SSUsers.list.length}</h5>
                            </div>
                            <div className={sty.menuTopListBody}>
                                <div className={sty.menuTopListBodyText}>
                                    <h4 className={sty.menuTopListTtl}>Active Users</h4>
                                    <h5 className={sty.menuTopListSbtl}>{`${SSUserPanel.user.id === SSUser.id ? 'You' : SSUserPanel.user.name} ${SSUserPanel.activity}`}</h5>
                                </div>
                                <div className={sty.menuTopListIndView}>
                                    <Icon name='people' size={30} color='--white' />
                                </div>
                            </div>
                        </div>

                        <div className={sty.menuList}>
                            <div className={sty.menuListItem}>
                                <h5 className={sty.menuListItemLabel}>Username</h5>
                                <input className={sty.menuListItemInput} type='text' autoComplete='off' placeholder='Username' value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => submitUser()}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') submitUser() }}
                                />
                            </div>
                            <div className={sty.menuListItem} onClick={() => STUser.color = genColor()}>
                                <h5 className={sty.menuListItemLabel}>Message Color</h5>
                                <div className={sty.menuMsgColor} style={{ backgroundColor: SSUser.color }}></div>
                            </div>
                        </div>

                        <div className={sty.menuList}>
                            <div className={sty.menuListItem} onClick={() => openScreen('Quests')}>
                                <h5 className={sty.menuListItemLabel}>Messages</h5>
                                <Icon name='chatbubble' size={24} color='--white' />
                            </div>
                            <div className={sty.menuListItem} onClick={() => openScreen('Shares')}>
                                <h5 className={sty.menuListItemLabel}>Shares</h5>
                                <Icon name='paper-plane' size={24} color='--white' />
                            </div>
                            <div className={sty.menuListItem} onClick={() => openScreen('Slides')}>
                                <h5 className={sty.menuListItemLabel}>Slides</h5>
                                <Icon name='albums' size={24} color='--white' />
                            </div>
                        </div>

                        <div className={sty.menuList}>
                            <div className={sty.menuListItem} onClick={() => resizeWindow()}>
                                <h5 className={sty.menuListItemLabel} >{`${SSApp.isFullscreen ? 'Exit' : 'Enter'} Full screen`}</h5>
                                <Icon name={SSApp.isFullscreen ? 'contract' : 'expand'} size={24} color='--white' />
                            </div>
                        </div>
                    </motion.div>
                    <motion.button className={sty.menuCloseBtn}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        onClick={() => closeScreen()}
                    >
                        <Icon name='close-circle-o' size={30} color='--system-blue' />
                    </motion.button>
                </>}
            </AnimatePresence>
        </>
    )
}