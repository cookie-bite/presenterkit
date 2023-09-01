import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'
import { genColor } from '../../utilities/core.utils'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Menu = ({ ws }) => {
    const [username, setUsername] = useState('')

    const appSnap = useSnapshot(STApp)


    const openScreen = (screen) => {
        STApp.uiName = screen
    }

    const closeScreen = () => {
        STApp.uiName = ''
    }

    const resizeWindow = () => {
        if (appSnap.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STApp.isFullscreen = !appSnap.isFullscreen
    }

    const submitUser = () => {
        if (appSnap.username !== username) {
            STApp.username = username
            ws.send(JSON.stringify({ command: 'SET_USER', room: STApp.userRoom, userID: appSnap.userID, username: username, roomActivity: 'updated' }))
        }
    }

    useEffect(() => setUsername(appSnap.username), [appSnap.username])


    return (
        <>
            <div className={sty.menuBg} onClick={() => closeScreen()}></div>
            <div className={sty.menuView}>
                <div className={sty.menuTopList}>
                    <div className={sty.menuTopListIcView}>
                        <h5 className={sty.menuTopListInd}>{appSnap.userList.length}</h5>
                    </div>
                    <div className={sty.menuTopListBody}>
                        <div className={sty.menuTopListBodyText}>
                            <h4 className={sty.menuTopListTtl}>Active Users</h4>
                            <h5 className={sty.menuTopListSbtl}>{`${appSnap.roomActivity.user.id === appSnap.userID ? 'You' : appSnap.roomActivity.user.name} ${appSnap.roomActivity.activity}`}</h5>
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
                    <div className={sty.menuListItem} onClick={() => STApp.userColor = genColor()}>
                        <h5 className={sty.menuListItemLabel}>Message Color</h5>
                        <div className={sty.menuMsgColor} style={{ backgroundColor: appSnap.userColor }}></div>
                    </div>
                </div>

                <div className={sty.menuList}>
                    <div className={sty.menuListItem} onClick={() => openScreen('Quests') }>
                        <h5 className={sty.menuListItemLabel}>Messages</h5>
                        <Icon name='chatbubble' size={24} color='--white' />
                    </div>
                    <div className={sty.menuListItem} onClick={() => openScreen('Shares') }>
                        <h5 className={sty.menuListItemLabel}>Shares</h5>
                        <Icon name='paper-plane' size={24} color='--white' />
                    </div>
                    <div className={sty.menuListItem} onClick={() => openScreen('Slides') }>
                        <h5 className={sty.menuListItemLabel}>Slides</h5>
                        <Icon name='albums' size={24} color='--white' />
                    </div>
                </div>

                <div className={sty.menuList}>
                    <div className={sty.menuListItem} onClick={() => resizeWindow()}>
                        <h5 className={sty.menuListItemLabel} >{`${appSnap.isFullscreen ? 'Exit' : 'Enter'} Full screen`}</h5>
                        <Icon name={appSnap.isFullscreen ? 'contract' : 'expand'} size={24} color='--white' />
                    </div>
                </div>
            </div>
            <button className={sty.menuCloseBtn} onClick={() => closeScreen()}>
                <Icon name='close' size={20} color='--white' />
            </button>
        </>
    )
}