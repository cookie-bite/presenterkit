import React, { useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp } from '../stores/app.store'


export const Input = ({ ws }) => {
    const appSnap = useSnapshot(STApp)
    const [text, setText] = useState('')
    
    
    const send = () => {
        if (text.trim() !== '') {
            ws.send(JSON.stringify({ command: 'APR_REQ', room: STApp.adminRoom, userID: appSnap.userID, username: appSnap.username, quest: { label: text } }))
            setText('')
        }
    }


    const sty = {
        inputView: {
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            transition: 'all 1s ease-out'
        },
        input: {
            display: 'flex',
            flex: 1,
            height: 44,
            border: 'none',
            fontSize: 17,
            borderRadius: 22,
            margin: 10,
            padding: '10px 15px',
            color: 'white',
            backdropFilter: 'saturate(180%) blur(20px)',
            '-webkit-backdrop-filter': 'saturate(180%) blur(20px)',
            backgroundColor: 'var(--thin-material)',
            transition: 'all 1s ease-out'
        },
        sendButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            height: 44,
            width: 44,
            borderRadius: 22,
            marginRight: 10,
            padding: 0,
            backgroundColor: 'var(--system-blue)',
            transition: 'all 1s ease-out'
        },
        sendButtonIcon: {
            height: 30,
            width: 30,
            filter: 'invert(100%)'
        }
    }


    return (
        <div style={sty.inputView}>
            <input style={sty.input} type='text' name='text' autoComplete='off' placeholder='Type a question...' value={text} 
                onChange={(e) => setText(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }} 
            />
            {text && <button style={sty.sendButton} onClick={() => send()}>
                <img style={sty.sendButtonIcon} src={'/icons/arrow-up.svg'} />
            </button>}
        </div>
    )
}