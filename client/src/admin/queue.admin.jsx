import { useSnapshot } from 'valtio'
import { STApp, STAdmin } from '../stores/app.store'
import sty from '../styles/admin.module.css'



const Settings = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)

    const forwarding = (state) => {
        ws.send(JSON.stringify({ command: 'SET_CNFG', config: { name: 'forwarding', is: state } }))
    }


    return (
        <div className={sty.settings}>
            <div className={sty.setting}>
                <h3 className={sty.settingLabel}>Forwarding</h3>
                <div className={sty.buttons}>

                    {adminSnap.config.forwarding.is
                        ? <button className={sty.button} style={{ backgroundColor: 'var(--system-red)', marginLeft: 5 }} onClick={() => forwarding(false)}>
                            <img className={sty.buttonIcon} src="/icons/close.svg" />
                        </button>
                        : <button className={sty.button} style={{ marginRight: 10 }} onClick={() => forwarding(true)}>
                            <img className={sty.buttonIcon} src="/icons/arrow-up.svg" />
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}


const Quest = ({ ws, data, index }) => {

    const aprReq = (act) => {
        ws.send(JSON.stringify({ command: 'SEND_USER', room: STApp.userRoom, userID: data.userID, username: data.author, aprReq: act, quest: { label: data.label, index } }))
        STAdmin.queue.splice(index, 1)
    }


    return (
        <div className={sty.questView} style={{ backgroundColor: `${index % 2 === 0 ? 'var(--secondary-sb)' : 'var(--quarternary-sb)'}` }}>
            <div className={sty.questBody}>
                <h6 className={sty.questAuthor}>{data.author}</h6>
                <h3 className={sty.questLabel}>{data.label}</h3>
            </div>
            <div className={sty.questBtn}>
                <button className={sty.button} style={{ marginRight: 10 }} onClick={() => aprReq(true)}>
                    <img className={sty.buttonIcon} src="/icons/arrow-up.svg" />
                </button>
                <button className={sty.button} style={{ backgroundColor: 'var(--system-red)', marginLeft: 5 }} onClick={() => aprReq(false)}>
                    <img className={sty.buttonIcon} src="/icons/close.svg" />
                </button>
            </div>
        </div>
    )
}


export const Queue = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)


    return (
        <>
            <Settings ws={ws} />
            <div className={sty.questList}>
                {adminSnap.queue.map((quest, index) => { return <Quest ws={ws} index={index} data={quest} /> })}
            </div>
        </>
    )
}