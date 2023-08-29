import { useSnapshot } from 'valtio'
import { STAdmin } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/admin.module.css'


export const Messages = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)

    const aprReq = (index) => {
        ws.send(JSON.stringify({ command: 'SEND_USER', userID: adminSnap.queue[index].userID, username: adminSnap.queue[index].author, quest: { label: adminSnap.queue[index].label, color: adminSnap.queue[index].color, index } }))
    }
    
    const rejectReq = (index) => {
        ws.send(JSON.stringify({ command: 'CLDW_USER', userID: adminSnap.queue[index].userID, quest: { index } }))
    }

    const forwarding = (state) => {
        console.log(adminSnap.queue)
        if ((adminSnap.activeCheckTab === 'Pass') === state) {
            STAdmin.activeCheckTab = state ? 'Stop' : 'Pass'
            ws.send(JSON.stringify({ command: 'SET_CNFG', config: { name: 'forwarding', is: state } }))
        }
    }


    return (
        <div className={sty.pageBg}>
            <div className={sty.page} style={{ width: 800 }}>
                <h2 className={sty.pageTitle}>Messages</h2>
                <div className={sty.switchTabs}>
                    <div className={sty.switchTab}
                        style={{ backgroundColor: adminSnap.activeCheckTab === 'Pass' ? 'var(--white)' : 'transparent' }}
                        onClick={() => forwarding(false)}
                    >
                        <h4 className={sty.switchTabLbl} style={{ color: adminSnap.activeCheckTab === 'Pass' ? 'var(--black)' : 'var(--primary-label)' }}>Pass</h4>
                    </div>
                    <div className={sty.switchTab}
                        style={{ backgroundColor: adminSnap.activeCheckTab === 'Stop' ? 'var(--white)' : 'transparent' }}
                        onClick={() => forwarding(true)}
                    >
                        <h4 className={sty.switchTabLbl} style={{ color: adminSnap.activeCheckTab === 'Stop' ? 'var(--black)' : 'var(--primary-label)' }}>Stop</h4>
                    </div>
                </div>
                {adminSnap.queue.length !== 0
                    ? <div className={sty.msgList}>
                        {adminSnap.queue.map((msg, index) => {
                            return (
                                <div className={sty.msgItem} key={index}>
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
                                </div>
                            )
                        })}
                    </div>
                    : <div className={sty.emptyPage}>
                        <h3 className={sty.emptyPageTtl}>No Pending Message</h3>
                        <h5 className={sty.emptyPageSbtl} onClick={() => forwarding(adminSnap.activeCheckTab === 'Pass')}>
                            {adminSnap.activeCheckTab === 'Pass' ? 'You can activate filter by clicking Stop' : 'You can turn off filter by clicking Pass'}
                        </h5>
                    </div>
                }
            </div>
        </div>
    )
}