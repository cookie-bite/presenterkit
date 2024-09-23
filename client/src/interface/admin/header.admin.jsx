import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STEvent, STUsers } from '../../stores/app.store'
import { STModerator, STSearch, STTab } from '../../stores/admin.store'
import { STDisplay } from '../../stores/scene.store'

import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/admin.module.css'


export const Header = ({ ws, core }) => {
    const SSUsers = useSnapshot(STUsers)
    const SSTab = useSnapshot(STTab)
    const SSModerator = useSnapshot(STModerator)
    const SSSearch = useSnapshot(STSearch)
    const SSDisplay = useSnapshot(STDisplay)

    const [title, setTitle] = useState('')
    const [term, setTerm] = useState('')


    const SearchList = () => {
        let results = SSUsers.list.filter((user) => !user.isAdmin && !user.isInLobby && user.username.toLowerCase().includes(term.trim().toLowerCase()))
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
                                    <div className={sty.moderatorAvtr} style={{ background: `linear-gradient(45deg, ${user.color}24, ${user.color}2B)` }} key={index}>
                                        <h1 className={sty.moderatorLbl} style={{ color: user.color }}>{user.username.charAt()}</h1>
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
        if (title.trim() !== '' && title !== STDisplay.quest && title !== '') {
            Object.assign(STDisplay, { quest: title, author: '' })
            ws.send(JSON.stringify({ command: 'DISP_LBL', eventID: STEvent.id, display: STDisplay }))
            setTitle('')
        }
    }

    const navigate = (tab) => {
        STTab.name = tab
    }

    const updateStatus = (userID, isAdmin) => {
        setTerm('')
        ws.send(JSON.stringify({ command: 'SET_STTS', eventID: STEvent.id, userID, isAdmin }))
    }

    const toggleModerator = (user) => {
        if (!user.isPresenter) STModerator.active = STModerator.active === user.userID ? '' : user.userID
    }

    const toggleSearch = () => {
        setTerm('')
        STSearch.showBar = !STSearch.showBar
    }


    useEffect(() => {
        return () => STSearch.showBar = false
    }, [])


    return (
        <div className={sty.header}>
            <div className={sty.headline}>
                <h3 className={sty.headlineLbl}>3D Title</h3>
                <input className={sty.headlineInput} type='text' name='title' autoComplete='off' placeholder={SSDisplay.quest} value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }}
                />
                <button className={sty.headlineBtn} style={{ backgroundColor: (title !== SSDisplay.quest && title !== '') ? 'var(--blue)' : 'var(--fill-3)' }} onClick={() => send()}>
                    <Icon name='sync' size={20} color='--white' />
                </button>
            </div>
            <div className={sty.tabs}>
                <button className={SSTab.name === 'Messages' ? sty.tabBtnActive : sty.tabBtn} onClick={() => navigate('Messages')}>
                    <Icon name='chatbubble-o' size={22} color={SSTab.name === 'Messages' ? '--white' : '--label-2'} />
                    <div className='tooltip tooltipBottom'>Messages</div>
                </button>
                <button className={SSTab.name === 'Shares' ? sty.tabBtnActive : sty.tabBtn} onClick={() => navigate('Shares')}>
                    <Icon name='paper-plane-o' size={22} color={SSTab.name === 'Shares' ? '--white' : '--label-2'} />
                    <div className='tooltip tooltipBottom'>Shares</div>
                </button>
            </div>
            <div className={sty.moderators}>
                <AnimatePresence>
                    {SSUsers.list.map((user, index) => {
                        return (
                            user.isAdmin && <motion.div className={sty.moderator} key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ ease: 'easeInOut', duration: 0.3 }}
                                onClick={() => toggleModerator(user)}
                            >
                                <div className={sty.moderatorAvtr} style={{ background: `linear-gradient(45deg, ${user.color}24, ${user.color}2B)`, cursor: user.isPresenter ? 'default' : 'pointer' }}>
                                    <h1 className={sty.moderatorLbl} style={{ color: user.color }}>{user.username.charAt()}</h1>
                                </div>
                                {SSModerator.active === user.userID && <div className={sty.activeModerator}>
                                    <h5 className={sty.activeModeratorLbl}>{user.username}</h5>
                                    <button onClick={() => updateStatus(user.userID, false)}>
                                        <Icon name='person-remove' size={15} color='--red' />
                                    </button>
                                </div>}
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
                <AnimatePresence>
                    {SSSearch.showBar && <motion.div className={sty.searchBar}>
                        <motion.input className={sty.searchInput} type='text' name='term' autoComplete='off' placeholder='Add moderator' value={term}
                            initial={{ opacity: 0, borderWidth: 0, width: 0, padding: 0, margin: 0 }}
                            animate={{ opacity: 1, borderWidth: 1, width: 220, padding: '10px 15px', margin: '0 5px' }}
                            exit={{ opacity: 0, borderWidth: 0, width: 0, padding: 0, margin: 0 }}
                            transition={{ ease: 'easeOut', duration: 0.4 }}
                            onChange={(e) => setTerm(e.target.value)}
                            onFocus={() => STSearch.showList = true}
                            onBlur={() => setTimeout(() => STSearch.showList = false, 150)}
                        />
                        <AnimatePresence>
                            {SSSearch.showList && <SearchList />}
                        </AnimatePresence>
                    </motion.div>
                    }
                </AnimatePresence>
                <button className={SSSearch.showBar ? sty.searchBtnActive : sty.searchBtn} onClick={() => toggleSearch()}>
                    <Icon name='add' size={20} color='--tint' />
                </button>
            </div>
        </div>
    )
}