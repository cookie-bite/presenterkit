import { motion, AnimatePresence, usePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STAdmin } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'
import { Segment } from '../../components/core.cmp'


import sty from '../../styles/modules/admin.module.css'


const Message = ({ ws, msg, index }) => {
    const adminSnap = useSnapshot(STAdmin)

    const [isPresent, safeToRemove] = usePresence()


    const aprReq = (index) => {
        ws.send(JSON.stringify({ command: 'SEND_USER', userID: adminSnap.queue[index].userID, username: adminSnap.queue[index].author, quest: { label: adminSnap.queue[index].label, color: adminSnap.queue[index].color, index } }))
    }

    const rejectReq = (index) => {
        ws.send(JSON.stringify({ command: 'CLDW_USER', userID: adminSnap.queue[index].userID, quest: { index } }))
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
                        <Icon name='remove-circle-o' size={20} color='--system-red' />
                    </button>
                </div>
                <h3 className={sty.msgLbl} style={{ color: msg.color }}>{msg.label}</h3>
            </div>
            <button className={sty.msgCheckBtn} onClick={() => aprReq(index)}>
                <Icon name='checkmark-circle-o' size={30} color='--system-green' />
            </button>
        </motion.div >
    )
}


export const Messages = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)

    const segments = ['Pass', 'Stop']


    const forwarding = (state) => {
        if ((adminSnap.activeCheckTab === 'Pass') === state) {
            STAdmin.activeCheckTab = state ? 'Stop' : 'Pass'
            ws.send(JSON.stringify({ command: 'SET_CNFG', config: { name: 'forwarding', is: state } }))
        }
    }

    const onSegmentChange = (segment) => {
        forwarding(segment === 'Stop')
    }

    const toggle = () => {
        STAdmin.activeCheckTab = adminSnap.activeCheckTab === 'Pass' ? 'Stop' : 'Pass'
        forwarding(adminSnap.activeCheckTab === 'Pass')
    }


    return (
        <div className={sty.pageBg}>
            <div className={sty.page} style={{ width: 800 }}>
                <Segment segments={segments} state={adminSnap.activeCheckTab} onChange={(index, segment) => onSegmentChange(segment)} />

                {adminSnap.queue.length !== 0
                    ? <div className={sty.msgList}>
                        <AnimatePresence>
                            {adminSnap.queue.map((msg, index) => {
                                return <Message ws={ws} msg={msg} index={index} key={msg.id} />
                            })}
                        </AnimatePresence>
                    </div>
                    : <div className={sty.emptyPage}>
                        <h3 className={sty.emptyPageTtl}>No Pending Message</h3>
                        <h5 className={sty.emptyPageSbtl} onClick={() => toggle()}>
                            {adminSnap.activeCheckTab === 'Pass' ? 'You can activate filter by clicking Stop' : 'You can turn off filter by clicking Pass'}
                        </h5>
                    </div>
                }
            </div>
        </div>
    )
}