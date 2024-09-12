import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTAuth } from '../../routes/routes'

import { STAuthUI, STUser } from '../../stores/app.store'

import { goTo, Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/account.module.css'


export const Auth = () => {
    const SSAuthUI = useSnapshot(STAuthUI)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onChange = (value, set) => {
        set(value)
    }

    const signIn = () => {
        RTAuth.signIn(email, password).then((data) => {
            if (data.success) {
                localStorage.setItem('EMAIL', email)
                localStorage.setItem('ACS_TKN', data.accessToken)
                localStorage.setItem('RFS_TKN', data.refreshToken)
                localStorage.setItem('SIGNED_IN', 'true')
                goTo('/dashboard')
            }
        })
    }
    
    
    const signUp = () => {
        RTAuth.signUp(username, email, password, STUser.color).then((data) => {
            if (data.success) {
                localStorage.setItem('EMAIL', email)
                localStorage.setItem('ACS_TKN', data.accessToken)
                localStorage.setItem('RFS_TKN', data.refreshToken)
                localStorage.setItem('SIGNED_IN', 'true')
                goTo('/dashboard')
            }
        })
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button className={sty.menuBtn} onClick={() => STAuthUI.name = 'SignIn'}>Sign in</button>
            {SSAuthUI.name === 'SignIn' && <div className={sty.menu}>
                <input className={sty.menuInput} style={{ marginTop: 15 }} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                <input className={sty.menuInput} style={{ marginTop: 5 }} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                <button className={sty.menuBtn} onClick={() => signIn()}>Sign in</button>
            </div>}
            <button className={sty.menuBtn} onClick={() => STAuthUI.name = 'SignUp'}>Sign up</button>
            {SSAuthUI.name === 'SignUp' && <div className={sty.menu}>
                <input className={sty.menuInput} style={{ marginTop: 15 }} name='username' placeholder='Username' type='text' value={username} onChange={(e) => onChange(e.target.value, setUsername)} />
                <input className={sty.menuInput} style={{ marginTop: 5 }} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                <input className={sty.menuInput} style={{ marginTop: 5 }} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                <button className={sty.menuBtn} onClick={() => signUp()}>Sign Up</button>
            </div>}
        </div>
    )
}   