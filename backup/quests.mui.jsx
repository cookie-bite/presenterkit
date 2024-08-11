import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STQuests, STUI } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Quests = () => {
    const SSUI = useSnapshot(STUI)
    const SSQuests = useSnapshot(STQuests)

    const msgs = [
        {
            effect: true,
            color: '#0c9bb0',
            label: 'Best sorting algorithm?',
            userID: 11,
            username: 'Toni Johnson'
        },
        {
            effect: true,
            color: '#991a3e',
            label: 'How to reverse an array?',
            userID: 3,
            username: 'Carter Riley'
        },
        {
            effect: true,
            color: '#906a05',
            label: 'Are arrays LIFO or FIFO?',
            userID: 19,
            username: 'Laurie Morgan'
        },
        {
            effect: true,
            color: '#5fc832',
            label: 'Can you show an example?',
            userID: 6,
            username: 'Christine Berry'
        },
        {
            effect: true,
            color: '#d45ecc',
            label: 'What are dynamic data structures?',
            userID: 18,
            username: 'Shawn Smith'
        },
        {
            effect: true,
            color: '#9d11ee',
            label: 'Is an array a stack?',
            userID: 10,
            username: 'Mattie Bowman'
        }
    ]


    return (
        <AnimatePresence>
            {SSUI.name === 'Quests' && <motion.div className={sty.modalView}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
                <div className={sty.modal}>
                    <div className={sty.modalHeader}>
                        <div className={sty.modalLblView}>
                            {SSQuests.list.length !== 0 && <div className={sty.modalCountBg}>
                                <h1 className={sty.modalCount}>{SSQuests.list.length}</h1>
                            </div>}
                            <h3 className={sty.modalHeaderLbl}>Messages</h3>
                        </div>
                        <button className={sty.modalHeadBtn} onClick={() => STUI.name = ''}>
                            <Icon name='close' size={20} color='--white' />
                        </button>
                    </div>
                    {msgs.length
                        ? <div className={sty.questList}>
                            {msgs.map((quest, index) => {
                                return (
                                    <div className={sty.questListItem} key={index}>
                                        <h3 className={sty.questListItemSbtl}>{quest.username}</h3>
                                        <h1 className={sty.questListItemTtl} style={{ color: quest.color, textShadow: quest.effect ? `0 0 10px ${quest.color}` : 'none' }}>{quest.label}</h1>
                                    </div>
                                )
                            })}
                        </div>
                        : <div className={sty.modalEmpty}>
                            <h3 className={sty.modalEmptyTtl}>No One Asked Yet</h3>
                            <h5 className={sty.modalEmptySbtl} onClick={() => STUI.name = ''}>Never afraid of being the first.</h5>
                        </div>
                    }
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}