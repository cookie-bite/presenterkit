import { motion, AnimatePresence, usePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'

import { STMessages, STQueue } from '../../stores/admin.store'
import { STEvent } from '../../stores/app.store'

import { Icon } from '../../components/core.cmp'
import { Segment } from '../../components/core.cmp'


import sty from '../../styles/modules/admin.module.css'


const Message = ({ ws, msg, index }) => {
    const [isPresent, safeToRemove] = usePresence()


    const aprReq = (index) => {
        ws.send(JSON.stringify({ command: 'SEND_USERS', eventID: STEvent.id, id: STQueue.list[index].id, quest: { label: STQueue.list[index].label, color: STQueue.list[index].color, index } }))
    }

    const rejectReq = (index) => {
        ws.send(JSON.stringify({ command: 'CLDW_USER', eventID: STEvent.id, userID: STQueue.list[index].userID, quest: { index } }))
    }


    return (
        <motion.div className={sty.msgItem}
            layout={true}
            style={{ position: isPresent ? 'static' : 'absolute' }}
            initial={'out'}
            animate={isPresent ? 'in' : 'out'}
            variants={{
                in: { scaleY: 1, opacity: 1 },
                out: { scaleY: 0, opacity: 0 }
            }}
            onAnimationComplete={() => !isPresent && safeToRemove()}
        >
            <div className={sty.msgBody}>
                <div className={sty.msgUser}>
                    <h5 className={sty.msgUserLbl}>{msg.author}</h5>
                    <button className={sty.msgUserBtn} onClick={() => rejectReq(index)}>
                        <Icon name='remove-circle-o' size={20} color='--red' />
                    </button>
                </div>
                <h3 className={sty.msgLbl} style={{ color: msg.color }}>{msg.label}</h3>
            </div>
            <button className={sty.msgCheckBtn} onClick={() => aprReq(index)}>
                <Icon name='checkmark-circle-o' size={30} color='--green' />
            </button>
        </motion.div >
    )
}



export const Messages = ({ ws }) => {
    const SSQueue = useSnapshot(STQueue)
    const SSMessages = useSnapshot(STMessages)

    const segments = ['Pass', 'Stop']


    const forwarding = (state) => {
        if ((SSMessages.tab === 'Pass') === state) {
            STMessages.tab = state ? 'Stop' : 'Pass'
            ws.send(JSON.stringify({ command: 'SET_CNFG', eventID: STEvent.id, config: { name: 'forwarding', is: state } }))
        }
    }

    const onSegmentChange = (segment) => {
        forwarding(segment === 'Stop')
    }

    const toggle = () => {
        STMessages.tab = SSMessages.tab === 'Pass' ? 'Stop' : 'Pass'
        forwarding(SSMessages.tab === 'Pass')
    }


    return (
        <div className={sty.pageBg}>
            <div className={sty.page} style={{ width: 800 }}>
                <Segment segments={segments} state={SSMessages.tab} onChange={(index, segment) => onSegmentChange(segment)} />

                {SSQueue.list.length !== 0
                    ? <div className={sty.msgList}>
                        <AnimatePresence>
                            {SSQueue.list.map((msg, index) => {
                                return <Message ws={ws} msg={msg} index={index} key={msg.id} />
                            })}
                        </AnimatePresence>
                    </div>
                    : <div className={sty.emptyPage}>
                        <h3 className={sty.emptyPageTtl}>No Pending Message</h3>
                        <h5 className={sty.emptyPageSbtl} onClick={() => toggle()}>
                            {SSMessages.tab === 'Pass' ? 'You can activate filter by clicking Stop' : 'You can turn off filter by clicking Pass'}
                        </h5>
                    </div>
                }
            </div>
        </div>
    )
}