import { useEffect, useState } from 'react'
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

    const [usernameErr, setUsernameErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [passErr, setPassErr] = useState(false)
    const [formValid, setFormValid] = useState(false)

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    const onChange = (label, value, set) => {
        set(value)

        if (label === 'username') {
            if (3 < value.length && value.length < 30) setUsernameErr(false)
        } else if (label === 'email') {
            if (emailPattern.test(value)) setEmailErr(false)
        } else if (label === 'password') {
            if (value.length > 5) setPassErr(false)
        }
    }

    const onBlur = async (label) => validate(label)

    const validate = (label) => {
        return new Promise((resolve) => {

            if (label === 'username') {
                setUsernameErr(username.length < 3 || username.length > 30)
            } else if (label === 'email') {
                setEmailErr(!emailPattern.test(email))
            } else if (label === 'password') {
                setPassErr(password.length < 6)
            }

            (password.length > 5 && emailPattern.test(email)) ? setFormValid(true) : setFormValid(false)

            resolve()
        })
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


    const signUp = async () => {
        await validate('password')

        // formValid && RTAuth.signUp(username, email, password, STUser.color).then((data) => {
        //     if (data.success) {
        //         localStorage.setItem('EMAIL', email)
        //         localStorage.setItem('ACS_TKN', data.accessToken)
        //         localStorage.setItem('RFS_TKN', data.refreshToken)
        //         localStorage.setItem('SIGNED_IN', 'true')
        //         goTo('/dashboard')
        //     }
        // })
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
                        <input name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange('email', e.target.value, setEmail)} />
                        <input name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange('password', e.target.value, setPassword)} />
                        <button className={sty.authBtn} onClick={() => signIn()}>Sign in</button>
                    </div>}
                    {SSAuthUI.name === 'SignUp' && <div className={sty.authInputs}>
                        <input name='username' placeholder='Username' type='text' value={username}
                            onBlur={() => onBlur('username')}
                            onChange={(e) => onChange('username', e.target.value, setUsername)} />
                        <input name='email' placeholder='Email' type='text' value={email}
                            onBlur={() => onBlur('email')}
                            onChange={(e) => onChange('email', e.target.value, setEmail)}
                        />
                        <input name='password' placeholder='Password' type='password' value={password}
                            onBlur={() => onBlur('password')}
                            onChange={(e) => onChange('password', e.target.value, setPassword)}
                        />
                        {usernameErr && <h1 style={{ color: 'red' }}>Invalid Username</h1>}
                        {emailErr && <h1 style={{ color: 'red' }}>Invalid Email</h1>}
                        {passErr && <h1 style={{ color: 'red' }}>Invalid Password</h1>}
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