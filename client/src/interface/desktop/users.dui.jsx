import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'
import { Icon, Panel } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Users = ({ ws }) => {
    const appSnap = useSnapshot(STApp)


    const UserList = () => {
        const [username, setUsername] = useState(appSnap.username)
        const [showEdit, setShowEdit] = useState()

        const inputRef = useRef()

        let user = appSnap.userList.filter(user => user.userID === appSnap.userID && !user.isPresenter)
        let presenter = appSnap.userList.filter(user => user.isPresenter)
        let users = appSnap.userList.filter(user => !user.isPresenter && user.userID !== appSnap.userID && !user.isInLobby)
        let lobbyUsers = appSnap.userList.filter(user => user.isInLobby)
        let result = [...user, ...presenter, ...users, ...lobbyUsers]


        const submitUser = () => {
            toggleInput()
            if (appSnap.username !== username) {
                ws.send(JSON.stringify({ command: 'SET_USER', room: STApp.userRoom, userID: appSnap.userID, username: username, roomActivity: 'updated' }))
                setTimeout(() => STApp.username = username, 500)
            }
        }

        const toggleInput = () => {
            if (showEdit) inputRef.current.blur()
            else inputRef.current.focus()
            setShowEdit(!showEdit)
        }


        return (
            result.map((user, index) => {
                return (
                    <div className={sty.userListItem} key={index}>
                        <div className={sty.userListItemAvatarView} style={{ background: `linear-gradient(45deg, ${user.userColor}24, ${user.userColor}2B)` }}>
                            <h1 className={sty.userListItemAvatarLbl} style={{ color: user.userColor }}>{index === 0 ? username.charAt() : user.username.charAt()}</h1>
                        </div>
                        <div className={sty.userListItemLblView}>
                            {index === 0
                                ? <input className={sty.userListItemInput} type='text' autoComplete='off' placeholder='Username' value={username}
                                    ref={inputRef}
                                    autoFocus={showEdit}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => { if (!showEdit) setShowEdit(true) }}
                                    onBlur={() => submitUser()}
                                    onKeyDown={(e) => e.code === 'Enter' && submitUser()}
                                />
                                : <h2 className={sty.userListItemLbl}>{user.username}</h2>
                            }
                            {index === 0 && <div className={sty.userListItemEdit} onClick={() => toggleInput()}>
                                {showEdit
                                    ? <Icon name='checkmark' size={14} color='--system-blue' />
                                    : <Icon name='pencil' size={14} color='--system-blue' />
                                }
                            </div>}
                        </div>
                    </div>
                )
            })
        )
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <Panel label={'Users'} count={appSnap.userList.length}>
            <div className={sty.userList}>
                <UserList />
            </div>
            <div className={sty.userInfo}>
                <div className={sty.userInfoBody}>
                    <div className={sty.userInfoIcView}>
                        {appSnap.roomActivity.activity === 'joined'
                            ? <Icon name='enter-o' size={24} color='--system-green' />
                            : <Icon name='exit-o' size={24} color='--system-red' />
                        }
                    </div>
                    <h5 className={sty.userInfoLbl}>{`${appSnap.roomActivity.user.id === appSnap.userID ? 'You' : appSnap.roomActivity.user.name} ${appSnap.roomActivity.activity}`}</h5>
                </div>
            </div>
        </Panel>
    )
}