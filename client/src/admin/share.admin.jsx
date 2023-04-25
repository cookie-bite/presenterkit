import { useSnapshot } from 'valtio'
import { STApp, STAdmin } from '../stores/app.store'
import sty from '../styles/admin.module.css'


export const Share = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)

    const send = () => {
        if (STAdmin.share.text.trim() !==  ''){
            ws.send(JSON.stringify({ command: 'SHR_INFO', room: STApp.userRoom, share: STAdmin.share }))
            STAdmin.share.text = ''
        }
    }


    return (
        <div className={sty.view}>
            <h2 className={sty.label}>Share</h2>
            <div className={sty.bottom}>
                <input className={sty.input} type='text' name='text' autoComplete='off' placeholder='Type a text...' value={adminSnap.share.text}
                    onChange={(e) => STAdmin.share.text = e.target.value}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }}
                />
                <button className={sty.button} onClick={() => send()}>
                    <img className={sty.buttonIcon} src={'/icons/arrow-up.svg'} />
                </button>
            </div>
        </div>          
    )
}