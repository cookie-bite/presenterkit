import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STEvent, STUI, STUser, STUserPanel, STUsers } from '../../stores/app.store'
import { Icon, Panel } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Users = ({ ws, core }) => {
    const SSUI = useSnapshot(STUI)
    const SSUser = useSnapshot(STUser)
    const SSUsers = useSnapshot(STUsers)
    const SSUserPanel = useSnapshot(STUserPanel)


    const UserList = () => {
        const [username, setUsername] = useState(STUser.name)
        const [showEdit, setShowEdit] = useState()

        const inputRef = useRef()

        let user = STUsers.list.filter(user => user.userID === STUser.id && !user.isPresenter)
        let presenter = STUsers.list.filter(user => user.isPresenter)
        let users = STUsers.list.filter(user => !user.isPresenter && user.userID !== STUser.id && !user.isInLobby)
        let lobbyUsers = STUsers.list.filter(user => user.isInLobby)
        let result = [...user, ...presenter, ...users, ...lobbyUsers]


        const submitUser = () => {
            toggleInput()
            if (STUser.name !== username) {
                ws.send(JSON.stringify({ command: 'SET_USER', eventID: STEvent.id, username, roomActivity: 'updated', token: localStorage.getItem('ACS_TKN') }))
                setTimeout(() => STUser.name = username, 500)
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
                    <div className={sty.userListItem} style={{ opacity: user.isActive ? 1 : 0.5 }} key={index}>
                        <div className={sty.userListItemAvatarView} style={{ background: `linear-gradient(45deg, ${user.color}24, ${user.color}2B)` }}>
                            <h1 className={sty.userListItemAvatarLbl} style={{ color: user.color }}>{index === 0 ? username.charAt() : user.username.charAt()}</h1>
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
                                <Icon name={showEdit ? 'checkmark' : 'pencil'} size={14} color='--primary-tint' />
                            </div>}
                        </div>
                    </div>
                )
            })
        )
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape' && STUI.name === 'Users') STUI.name = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <Panel show={SSUI.name === 'Users'} label={'Users'} count={SSUsers.list.length}>
            <div className={sty.userList}>
                <UserList />
            </div>
            <div className={sty.userInfo}>
                <div className={sty.userInfoBody}>
                    <div className={sty.userInfoIcView}>
                        {SSUserPanel.activity === 'joined'
                            ? <Icon name='enter-o' size={24} color='--system-green' />
                            : <Icon name='exit-o' size={24} color='--system-red' />
                        }
                    </div>
                    <h5 className={sty.userInfoLbl}>{`${SSUserPanel.user.id === SSUser.id ? 'You' : SSUserPanel.user.name} ${SSUserPanel.activity}`}</h5>
                </div>
            </div>
        </Panel>
    )
}