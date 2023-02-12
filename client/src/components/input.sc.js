import React, { useState } from 'react'


const ws = new WebSocket(`ws://${window.location.hostname}:3000`)

export const Input = () => {
    const [text, setText] = useState('')

    const send = () => {
        if (text.trim() !== '') {
            ws.send(JSON.stringify({ message: text, params: { room: 2 } }))
            setText('')
            console.log('sent messages:', text)
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
            border: 'none',
            height: 44,
            borderRadius: 22,
            marginRight: 10,
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
            <input style={sty.input} type="text" name="text" autoComplete='off' placeholder="Type a question..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') send(); }} />
            {text && <button style={sty.sendButton} onClick={() => send()}>
                <img style={sty.sendButtonIcon} src="/icons/arrow-up.svg" />
            </button>}
        </div>
    )
}