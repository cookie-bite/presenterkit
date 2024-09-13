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
        <div className={sty.authBg}>
            <div className={sty.auth}>
                <div className={sty.authLogo}>
                    <img className={sty.authLogoImg} src='/logo.svg' alt='logo' />
                    <h1 className={sty.authLogoLbl}>PresenterKit</h1>
                </div>
                <div className={sty.authNav}>
                    <button className={sty.authNavBtn} style={{ backgroundColor: STAuthUI.name === 'SignIn' ? 'var(--primary-fill)' : 'transparent' }} onClick={() => STAuthUI.name = 'SignIn'}>Sign in</button>
                    <button className={sty.authNavBtn} style={{ backgroundColor: STAuthUI.name === 'SignUp' ? 'var(--primary-fill)' : 'transparent' }} onClick={() => STAuthUI.name = 'SignUp'}>Sign up</button>
                </div>

                {SSAuthUI.name === 'SignIn' && <div className={sty.authForm}>
                    <input className={sty.authInput} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                    <input className={sty.authInput} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                    <button className={sty.authBtn} onClick={() => signIn()}>Sign in</button>
                </div>}
                {SSAuthUI.name === 'SignUp' && <div className={sty.authForm}>
                    <input className={sty.authInput} name='username' placeholder='Username' type='text' value={username} onChange={(e) => onChange(e.target.value, setUsername)} />
                    <input className={sty.authInput} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                    <input className={sty.authInput} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                    <button className={sty.authBtn} onClick={() => signUp()}>Sign Up</button>
                </div>}
            </div>
        </div>
    )
}   