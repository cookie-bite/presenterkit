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
                <div className={sty.authForm}>
                    <div className={sty.authNav}>
                        <button style={{ backgroundColor: STAuthUI.name === 'SignIn' ? 'var(--fill-1)' : 'transparent' }} onClick={() => STAuthUI.name = 'SignIn'}>Sign in</button>
                        <button style={{ backgroundColor: STAuthUI.name === 'SignUp' ? 'var(--fill-1)' : 'transparent' }} onClick={() => STAuthUI.name = 'SignUp'}>Sign up</button>
                    </div>

                    {SSAuthUI.name === 'SignIn' && <div className={sty.authInputs}>
                        <input name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                        <input name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                        <button className={sty.authBtn} onClick={() => signIn()}>Sign in</button>
                    </div>}
                    {SSAuthUI.name === 'SignUp' && <div className={sty.authInputs}>
                        <input name='username' placeholder='Username' type='text' value={username} onChange={(e) => onChange(e.target.value, setUsername)} />
                        <input name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                        <input name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                        <button className={sty.authBtn} onClick={() => signUp()}>Sign Up</button>
                    </div>}
                </div>
                <div className={sty.authBanner}>
                    <div className={sty.authLogo}>
                        <img src='/logo.svg' alt='logo' />
                        <h1>PresenterKit</h1>
                    </div>

                    <h2>Boost interactivity even offline.<br />Slide Share & 3D Messaging.</h2>
                </div>
            </div>
        </div>
    )
}   