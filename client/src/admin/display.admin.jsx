import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STAdmin } from '../stores/app.store'
import sty from '../styles/admin.module.css'


export const Display = ({ ws }) => {
    const adminSnap = useSnapshot(STAdmin)
    const [text, setText] = useState('')

    const send = () => {
        if (text.trim() !== '') {
            STAdmin.display = { quest: text, author: '' }
            ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STAdmin.display }))
            setText('')
        }
    }


    return (
        <div className={sty.view}>
            <div className={sty.top}>
                <h4 className={sty.author}>{adminSnap.display.author}</h4>
                <h2 className={sty.label}>{adminSnap.display.quest}</h2>
            </div>
            <div className={sty.center}>
                <h1 className={sty.preview}>{text ? text : 'Display Text'}</h1>
            </div>
            <div className={sty.bottom}>
                <input className={sty.input} type='text' name='text' autoComplete='off' placeholder='Display Text' value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }}
                />
                <button className={sty.button} onClick={() => send()}>
                    <img className={sty.buttonIcon} src={'/icons/arrow-up.svg'} />
                </button>
            </div>
        </div>
    )
}