import React, { useState } from 'react'


export const Input = () => {
    const [text, setText] = useState('')

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
            <input style={sty.input} type="text" name="text" autoComplete='off' placeholder="Type a question..." value={text} onChange={(e) => setText(e.target.value)} />
            {text && <button style={sty.sendButton} onClick={() => console.log('clicked')}>
                <img style={sty.sendButtonIcon} src="/icons/arrow-up.svg" />
            </button>}
        </div>
    )
}