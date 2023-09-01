import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { STAdmin, STApp, STScene } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/admin.module.css'


export const Header = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)
    const sceneSnap = useSnapshot(STScene)

    const [title, setTitle] = useState('')
    const [term, setTerm] = useState('')


    const SearchList = () => {
        let results = adminSnap.userList.filter((user) => !user.isAdmin && !user.isInLobby && user.username.includes(term.trim()))
        let exactResults = results.filter((user) => user.username.startsWith(term.trim()))
        let finalResults = [...new Set([...exactResults, ...results])]

        return (
            <div className={sty.searchList}>
                {finalResults.length
                    ? <>
                        {finalResults.map((user, index) => {
                            return (
                                <div className={sty.searchListItem} onClick={() => updateStatus(user.userID, true)} key={index}>
                                    <div className={sty.moderatorAvtr} style={{ background: `linear-gradient(45deg, ${user.userColor}24, ${user.userColor}2B)` }} key={index}>
                                        <h1 className={sty.moderatorLbl} style={{ color: user.userColor }}>{user.username.charAt()}</h1>
                                    </div>
                                    <h4 className={sty.searchListItemLbl}>{user.username}</h4>
                                </div>
                            )
                        })}
                    </>
                    : <div className={sty.emptySearch}>
                        <h3 className={sty.emptySearchLbl}>No Users</h3>
                    </div>
                }
            </div>
        )
    }


    const send = () => {
        if (title.trim() !== '' && title !== sceneSnap.display.quest && title !== '') {
            STAdmin.display = { quest: title, author: '' }
            ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STAdmin.display }))
            setTitle('')
        }
    }

    const navigate = (tab) => {
        STAdmin.uiName = tab
    }

    const updateStatus = (userID, isAdmin) => {
        setTerm('')
        ws.send(JSON.stringify({ command: 'SET_STTS', room: STApp.userRoom, userID, isAdmin }))
    }

    const toggleModerator = (user) => {
        if (!user.isPresenter) STAdmin.activeAdmin = adminSnap.activeAdmin === user.userID ? '' : user.userID
    }

    const toggleSearch = () => {
        setTerm('')
        STAdmin.showSearch = !adminSnap.showSearch
    }


    return (
        <div className={sty.header}>
            <div className={sty.headline}>
                <h3 className={sty.headlineLbl}>3D Title</h3>
                <input className={sty.headlineInput} type='text' name='title' autoComplete='off' placeholder={sceneSnap.display.quest} value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }}
                />
                <button className={sty.headlineBtn} style={{ backgroundColor: (title !== sceneSnap.display.quest && title !== '') ? 'var(--system-blue)' : 'var(--tertiary-fill)' }} onClick={() => send()}>
                    <Icon name='sync' size={20} color='--white' />
                </button>
            </div>
            <div className={sty.tabs}>
                <button className={sty.tabBtn} style={adminSnap.uiName === 'Messages' ? { backgroundColor: 'var(--white)' } : null} onClick={() => navigate('Messages')}>
                    <Icon name='chatbubble-o' size={22} color={adminSnap.uiName === 'Messages' ? '--black' : '--white'} />
                </button>
                <button className={sty.tabBtn} style={adminSnap.uiName === 'Share' ? { backgroundColor: 'var(--white)' } : null} onClick={() => navigate('Share')}>
                    <Icon name='paper-plane-o' size={22} color={adminSnap.uiName === 'Share' ? '--black' : '--white'} />
                </button>
            </div>
            <div className={sty.moderators}>
                {adminSnap.userList.map((user, index) => {
                    return (
                        user.isAdmin && <div className={sty.moderator} onClick={() => toggleModerator(user)} key={index}>
                            <div className={sty.moderatorAvtr} style={{ background: `linear-gradient(45deg, ${user.userColor}24, ${user.userColor}2B)`, cursor: user.isPresenter ? 'default' : 'pointer' }}>
                                <h1 className={sty.moderatorLbl} style={{ color: user.userColor }}>{user.username.charAt()}</h1>
                            </div>
                            {adminSnap.activeAdmin === user.userID && <div className={sty.activeModerator}>
                                <h5 className={sty.activeModeratorLbl}>{user.username}</h5>
                                <button onClick={() => updateStatus(user.userID, false)}>
                                    <Icon name='person-remove' size={15} color='--system-red' />
                                </button>
                            </div>}
                        </div>
                    )
                })}
                {adminSnap.showSearch &&
                    <div className={sty.searchBar}>
                        <input className={sty.searchInput} type='text' name='term' autoComplete='off' placeholder='Add moderator' value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onFocus={() => STAdmin.showSearchList = true}
                            onBlur={() => setTimeout(() => STAdmin.showSearchList = false, 150)}
                        />
                        {adminSnap.showSearchList && <SearchList /> }
                    </div>
                }
                <button className={sty.searchBtn} onClick={() => toggleSearch()}>
                    <Icon name={adminSnap.showSearch ? 'close' : 'add'} size={20} color='--primary-tint' />
                </button>
            </div>
        </div>
    )
}