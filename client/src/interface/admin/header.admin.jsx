import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        let results = adminSnap.userList.filter((user) => !user.isAdmin && !user.isInLobby && user.username.toLowerCase().includes(term.trim().toLowerCase()))
        let exactResults = results.filter((user) => user.username.startsWith(term.trim()))
        let finalResults = [...new Set([...exactResults, ...results])]

        return (
            <motion.div className={sty.searchList}
                exit={{ opacity: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
            >
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
            </motion.div>
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


    useEffect(() => {
        return () => STAdmin.showSearch = false
    }, [])


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
                <button className={adminSnap.uiName === 'Messages' ? sty.tabBtnActive : sty.tabBtn} onClick={() => navigate('Messages')}>
                    <Icon name='chatbubble-o' size={22} color={adminSnap.uiName === 'Messages' ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipBottom'>Messages</div>
                </button>
                <button className={adminSnap.uiName === 'Shares' ? sty.tabBtnActive : sty.tabBtn} onClick={() => navigate('Shares')}>
                    <Icon name='paper-plane-o' size={22} color={adminSnap.uiName === 'Shares' ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipBottom'>Shares</div>
                </button>
            </div>
            <div className={sty.moderators}>
                <AnimatePresence>
                    {adminSnap.userList.map((user, index) => {
                        return (
                            user.isAdmin && <motion.div className={sty.moderator} key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ ease: 'easeInOut', duration: 0.3 }}
                                onClick={() => toggleModerator(user)}
                            >
                                <div className={sty.moderatorAvtr} style={{ background: `linear-gradient(45deg, ${user.userColor}24, ${user.userColor}2B)`, cursor: user.isPresenter ? 'default' : 'pointer' }}>
                                    <h1 className={sty.moderatorLbl} style={{ color: user.userColor }}>{user.username.charAt()}</h1>
                                </div>
                                {adminSnap.activeAdmin === user.userID && <div className={sty.activeModerator}>
                                    <h5 className={sty.activeModeratorLbl}>{user.username}</h5>
                                    <button onClick={() => updateStatus(user.userID, false)}>
                                        <Icon name='person-remove' size={15} color='--system-red' />
                                    </button>
                                </div>}
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
                <AnimatePresence>
                    {adminSnap.showSearch && <motion.div className={sty.searchBar}>
                        <motion.input className={sty.searchInput} type='text' name='term' autoComplete='off' placeholder='Add moderator' value={term}
                            initial={{ opacity: 0, borderWidth: 0, width: 0, padding: 0, margin: 0 }}
                            animate={{ opacity: 1, borderWidth: 1, width: 220, padding: '10px 15px', margin: '0 5px' }}
                            exit={{ opacity: 0, borderWidth: 0, width: 0, padding: 0, margin: 0 }}
                            transition={{ ease: 'easeOut', duration: 0.4 }}
                            onChange={(e) => setTerm(e.target.value)}
                            onFocus={() => STAdmin.showSearchList = true}
                            onBlur={() => setTimeout(() => STAdmin.showSearchList = false, 150)}
                        />
                        <AnimatePresence>
                            {adminSnap.showSearchList && <SearchList />}
                        </AnimatePresence>
                    </motion.div>
                    }
                </AnimatePresence>
                <button className={adminSnap.showSearch ? sty.searchBtnActive : sty.searchBtn} onClick={() => toggleSearch()}>
                    <Icon name='add' size={20} color='--primary-tint' />
                </button>
            </div>
        </div>
    )
}