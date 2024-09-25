import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTAuth } from '../../routes/routes'

import { STAuthUI, STUser } from '../../stores/app.store'

import { goTo, Icon, Segment } from '../../components/core.cmp'

import sty from '../../styles/modules/account.module.css'


export const Auth = () => {
    const SSAuthUI = useSnapshot(STAuthUI)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [usernameErr, setUsernameErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [passErr, setPassErr] = useState(false)
    const [lowercaseErr, setLowercaseErr] = useState(false)
    const [uppercaseErr, setUppercaseErr] = useState(false)
    const [digitErr, setDigitErr] = useState(false)
    const [specCharErr, setSpecCharErr] = useState(false)
    const [passLengthErr, setPassLengthErr] = useState(false)

    const [formErr, setFormErr] = useState(false)

    const RXUsername = /^.{3,30}$/
    const RXEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const RXPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).{8,}/
    const RXLowercase = /[a-z]/
    const RXUppercase = /[A-Z]/
    const RXDigit = /[0-9]/
    const RXSpecChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    const RXPassLength = /^.{8,30}$/

    const segments = ['SignIn', 'SignUp']
    const labels = ['Sign in', 'Sign up']


    const onSegmentChange = (segment) => { STAuthUI.name = segment }

    const onChange = (label, value, set) => {
        set(value)

        if (label === 'username') {
            if (RXUsername.test(value)) setUsernameErr(false)
        } else if (label === 'email') {
            if (RXEmail.test(value)) setEmailErr(false)
        } else if (label === 'password') {
            if (RXPassword.test(value)) setPassErr(false)

            setLowercaseErr(!RXLowercase.test(value))
            setUppercaseErr(!RXUppercase.test(value))
            setDigitErr(!RXDigit.test(value))
            setSpecCharErr(!RXSpecChar.test(value))
            setPassLengthErr(!RXPassLength.test(value))
        }
    }

    const onBlur = async (label) => validate(label)

    const validate = (label) => {
        return new Promise((resolve) => {

            if (label === 'username') {
                setUsernameErr(!RXUsername.test(username))
            } else if (label === 'email') {
                setEmailErr(!RXEmail.test(email))
            } else if (label === 'password') {
                setPassErr(!RXPassword.test(password))
                setLowercaseErr(!RXLowercase.test(password))
                setUppercaseErr(!RXUppercase.test(password))
                setDigitErr(!RXDigit.test(password))
                setSpecCharErr(!RXSpecChar.test(password))
                setPassLengthErr(!RXPassLength.test(password))
            }

            (RXUsername.test(username) && RXEmail.test(email) && RXPassword.test(password)) ? setFormErr(false) : setFormErr(true)

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
        await validate('username')
        await validate('email')
        await validate('password')

        // (!formErr) && RTAuth.signUp(username, email, password, STUser.color).then((data) => {
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
                    <div className={sty.authLogo}>
                        <img src='/logo.svg' alt='logo' />
                        <h3>PresenterKit</h3>
                    </div>

                    <Segment segments={segments} labels={labels} state={SSAuthUI.name} onChange={(index, segment) => onSegmentChange(segment)} />

                    {SSAuthUI.name === 'SignIn' && <>
                        <div className={sty.authInputs}>
                            <input name='email' placeholder='Email' type='text' value={email}
                                onChange={(e) => onChange('email', e.target.value, setEmail)}
                            />
                            <input name='password' placeholder='Password' type='password' value={password}
                                onChange={(e) => onChange('password', e.target.value, setPassword)}
                            />
                        </div>

                        <button className={sty.authBtn} onClick={() => signIn()}>Sign in</button>
                    </>}
                    {SSAuthUI.name === 'SignUp' && <>
                        <div className={sty.authInputs}>
                            <input name='username' placeholder='Username' type='text' value={username}
                                style={{ color: usernameErr ? 'var(--red)' : 'var(--white)' }}
                                onBlur={() => onBlur('username')}
                                onChange={(e) => onChange('username', e.target.value, setUsername)}
                            />

                            <input name='email' placeholder='Email' type='text' value={email}
                                style={{ color: emailErr ? 'var(--red)' : 'var(--white)' }}
                                onBlur={() => onBlur('email')}
                                onChange={(e) => onChange('email', e.target.value, setEmail)}
                                />

                            <input name='password' placeholder='Password' type='password' value={password}
                                onBlur={() => onBlur('password')}
                                onChange={(e) => onChange('password', e.target.value, setPassword)}
                            />

                            {passErr && <div className={sty.authPassErrs}>
                                <div className={sty.authPassErr} style={{ border: `1px solid ${lowercaseErr ? 'var(--red)' : 'var(--green)'}`, backgroundColor: lowercaseErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                                    <h4 style={{ color: lowercaseErr ? 'var(--red)' : 'var(--green)' }}>ab</h4>
                                </div>
                                <div className={sty.authPassErr} style={{ border: `1px solid ${uppercaseErr ? 'var(--red)' : 'var(--green)'}`, backgroundColor: uppercaseErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                                    <h4 style={{ color: uppercaseErr ? 'var(--red)' : 'var(--green)' }}>AB</h4>
                                </div>
                                <div className={sty.authPassErr} style={{ border: `1px solid ${digitErr ? 'var(--red)' : 'var(--green)'}`, backgroundColor: digitErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                                    <h4 style={{ color: digitErr ? 'var(--red)' : 'var(--green)' }}>12</h4>
                                </div>
                                <div className={sty.authPassErr} style={{ border: `1px solid ${specCharErr ? 'var(--red)' : 'var(--green)'}`, backgroundColor: specCharErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                                    <h4 style={{ color: specCharErr ? 'var(--red)' : 'var(--green)' }}>@#</h4>
                                </div>
                                <div className={sty.authPassErr} style={{ border: `1px solid ${passLengthErr ? 'var(--red)' : 'var(--green)'}`, backgroundColor: passLengthErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                                    <h4 style={{ color: passLengthErr ? 'var(--red)' : 'var(--green)' }}>8+</h4>
                                </div>
                            </div>}
                        </div>
                        <button className={sty.authBtn} onClick={() => signUp()}>Sign Up</button>
                    </>}
                </div>
                <div className={sty.authBanner}>
                    <img src='/imgs/auth.webp' />

                    <h2>Presentation and audience<br />engagement in one SaaS.</h2>
                </div>
            </div>
        </div>
    )
}   