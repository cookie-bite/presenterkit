import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STUI, STApp } from '../stores/app.store'
import { genColor } from '../utilities/core.utils'
import sty from '../styles/ui.module.css'


export const Menu = ({ ws }) => {
    const [username, setUsername] = useState('')

    const uiSnap = useSnapshot(STUI)
    const appSnap = useSnapshot(STApp)

    const resizeWindow = () => {
        if (uiSnap.menu.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STUI.menu.isFullscreen = !uiSnap.menu.isFullscreen
    }

    const toggleMenu = (state) => STUI.menu.isActive = state

    const submitUser = () => {
        if (appSnap.username !== username) {
            STApp.username = username
            ws.send(JSON.stringify({ command: 'SET_USER', room: STApp.userRoom, userID: appSnap.userID, username: username }))
        }
    }

    useEffect(() => setUsername(appSnap.username), [appSnap.username])


    return (
        <>
            {appSnap.share.isActive ? null : uiSnap.menu.isActive
                ? <button className={sty.sceneCornerCloseBtn} onClick={() => toggleMenu(false)}>
                    <img className={sty.cornerBtnIc} src='/icons/close.svg' />
                </button>
                : <button className={sty.sceneCornerBtn} onClick={() => toggleMenu(true)}>
                    <img className={sty.sceneCornerBtnIc} src='/icons/chatbubble-oc.svg' />
                </button>
            }
            {uiSnap.menu.isActive && <>
                <div className={sty.menuBg} onClick={() => toggleMenu(false)}></div>
                <div className={sty.menuView}>
                    <div className={sty.menuTopList}>
                        <div className={sty.menuTopListIcView}>
                            <h5 className={sty.menuTopListInd}>{appSnap.roomActivity.userList.length}</h5>
                        </div>
                        <div className={sty.menuTopListBody}>
                            <div className={sty.menuTopListBodyText}>
                                <h4 className={sty.menuTopListTtl}>Active Users</h4>
                                <h5 className={sty.menuTopListSbtl}>{`${appSnap.roomActivity.user.id === appSnap.userID ? 'You' : appSnap.roomActivity.user.name} ${appSnap.roomActivity.activity}`}</h5>
                            </div>
                            <div className={sty.menuTopListIndView}>
                                <img className={sty.menuTopListIc} src='/icons/people.svg' />
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
                        <div className={sty.menuListItem} onClick={() => STApp.indColor = genColor()}>
                            <h5 className={sty.menuListItemLabel}>Typing Indicator</h5>
                            <div className={sty.menuListItemInd} style={{ backgroundColor: appSnap.indColor }}></div>
                        </div>
                    </div>
                    <div className={sty.menuList}>
                        <div className={sty.menuListItem} onClick={() => { STApp.share = { isActive: true, data: { text: 'QUEST' } }; toggleMenu(false) }}>
                            <h5 className={sty.menuListItemLabel}>Question List</h5>
                            <img className={sty.menuListItemIc} src='/icons/chatbubble.svg' />
                        </div>
                        <div className={sty.menuListItem} onClick={() => resizeWindow()}>
                            <h5 className={sty.menuListItemLabel} >{`${uiSnap.menu.isFullscreen ? 'Exit' : 'Enter'} Full screen`}</h5>
                            <img className={sty.menuListItemIc} src={`/icons/${uiSnap.menu.isFullscreen ? 'contract' : 'expand'}.svg`} />
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}