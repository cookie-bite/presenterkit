import { useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { RTAuth } from '../../routes/routes'

import { STAuthUI, STUser } from '../../stores/app.store'

import { goTo, Segment, Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/dashboard.module.css'


export const Auth = () => {
  const SSAuthUI = useSnapshot(STAuthUI)

  const apiErrAnim = useAnimation()

  const [showOTPUI, setShowOTPUI] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [groupCode, setGroupCode] = useState(new Array(6).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)

  const [usernameErr, setUsernameErr] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [passErr, setPassErr] = useState(false)
  const [lowercaseErr, setLowercaseErr] = useState(false)
  const [uppercaseErr, setUppercaseErr] = useState(false)
  const [digitErr, setDigitErr] = useState(false)
  const [specCharErr, setSpecCharErr] = useState(false)
  const [passLengthErr, setPassLengthErr] = useState(false)

  const [signInFormErr, setSignInFormErr] = useState(false)
  const [signUpFormErr, setSignUpFormErr] = useState(false)

  const [apiErr, setApiErr] = useState('')

  const [groupCodeErr, setGroupCodeErr] = useState(false)

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

  const codeInputRefs = []


  const onSegmentChange = (segment) => {
    if (apiErr) setApiErr('')
    STAuthUI.name = segment
  }

  const onBlur = (label) => {
    validate(label)
  }

  const onChange = (label, value, set) => {
    set(value)

    if (label === 'username') {
      if (RXUsername.test(value)) setUsernameErr(false)
    } else if (label === 'email') {
      if (RXEmail.test(value)) setEmailErr(false)
    } else if (label === 'password') {
      setLowercaseErr(!RXLowercase.test(value))
      setUppercaseErr(!RXUppercase.test(value))
      setDigitErr(!RXDigit.test(value))
      setSpecCharErr(!RXSpecChar.test(value))
      setPassLengthErr(!RXPassLength.test(value))

      if (STAuthUI.name === 'SignIn' && RXPassword.test(value)) setTimeout(() => setPassErr(false), 300)
      else if (STAuthUI.name === 'SignUp') setTimeout(() => setPassErr(!RXPassword.test(value)), 300)
    }
  }

  const validate = (label) => {
    return new Promise((resolve) => {

      if (label === 'username') {
        setUsernameErr(!RXUsername.test(username))
      } else if (label === 'email') {
        setEmailErr(!RXEmail.test(email))
      } else if (label === 'password') {
        setLowercaseErr(!RXLowercase.test(password))
        setUppercaseErr(!RXUppercase.test(password))
        setDigitErr(!RXDigit.test(password))
        setSpecCharErr(!RXSpecChar.test(password))
        setPassLengthErr(!RXPassLength.test(password))
        setPassErr(!RXPassword.test(password))
      }

      if (RXUsername.test(username) && RXEmail.test(email) && RXPassword.test(password)) setSignUpFormErr(false)
      else setSignUpFormErr(true)

      if (RXEmail.test(email) && RXPassword.test(password)) setSignInFormErr(false)
      else setSignInFormErr(true)

      resolve()
    })
  }

  const signIn = async () => {
    await validate('email')
    await validate('password')


    if (!signInFormErr) RTAuth.signIn(email, password).then((data) => {
      if (data.success) {
        localStorage.setItem('EMAIL', email)
        localStorage.setItem('ACS_TKN', data.accessToken)
        localStorage.setItem('RFS_TKN', data.refreshToken)
        localStorage.setItem('SIGNED_IN', 'true')
        goTo('/dashboard')
      } else {
        setApiErr(data.error)

        apiErrAnim.start({ x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0] })
      }
    })
  }

  const initiateSignUp = async () => {
    await validate('username')
    await validate('email')
    await validate('password')

    if (!signUpFormErr) RTAuth.initiateSignUp(username, email, password, STUser.color).then((data) => {
      if (data.success) {
        setShowOTPUI(() => { setApiErr(''); return true })
      } else {
        setApiErr(data.error)
        apiErrAnim.start({ x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0] })
      }
    })
  }

  const onFocus = (index) => {
    setGroupCode(oldGroupCode => {
      let newGroupCode = [...oldGroupCode]
      const currentEmptyIndex = newGroupCode.findIndex(e => !e)

      if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
        setTimeout(() => codeInputRefs[currentEmptyIndex].focus(), 0)
        return oldGroupCode
      }

      for (const i in newGroupCode) {
        if (i >= index) newGroupCode[i] = ''
      }

      setActiveIndex(index)
      return newGroupCode
    })
  }

  const onChangeText = (text, index) => {
    var codePattern = /([0-9]{6})/

    if (text) {
      if (text.length > 1) {
        const pastedCode = text.slice(0, 6).split('')
        const newGroupCode = [...new Array(6).fill('')]
        pastedCode.forEach((char, i) => { if (i < 6) newGroupCode[i] = char })
        setGroupCode(newGroupCode)
        setGroupCodeErr(false)
        codeInputRefs[index]?.blur()
        if (text.length >= 6 && codePattern.test(newGroupCode.join(''))) {
          verifyCode(newGroupCode.join(''))
        }
        return
      }

      let newGroupCode = [...groupCode]
      newGroupCode[index] = text
      setGroupCode(newGroupCode)
      setGroupCodeErr(false)
      if (index !== 5) {
        codeInputRefs[index + 1].focus()
      } else if (index === 5) {
        codeInputRefs[index].blur()
        if (!codePattern.test(newGroupCode.join(''))) {
          setGroupCodeErr(true)
          setGroupCode(new Array(6).fill(''))
          codeInputRefs[0].focus()
        } else if (codePattern.test(newGroupCode.join(''))) {
          verifyCode(newGroupCode.join(''))
        }
      }
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Backspace') codeInputRefs[activeIndex > 0 ? activeIndex - 1 : 0].focus()
  }

  const verifyCode = (code) => {
    var codePattern = /([0-9]{6})/

    if (!codePattern.test(code)) {
      setApiErr('Invalid code')
      apiErrAnim.start({ x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0] })
      return
    }

    if (!signUpFormErr) RTAuth.confirmSignUp(email, code).then((data) => {
      if (data.success) {
        localStorage.setItem('EMAIL', email)
        localStorage.setItem('ACS_TKN', data.accessToken)
        localStorage.setItem('RFS_TKN', data.refreshToken)
        localStorage.setItem('SIGNED_IN', 'true')
        goTo('/dashboard')
      } else {
        setApiErr(data.error)
        apiErrAnim.start({ x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0] })
      }
    })
  }


  return (
    <div className={sty.authBg}>
      <div className={sty.auth}>
        <div className={sty.authForm}>
          <div className={sty.authLogo}>
            <img src='/logo.svg' alt='logo' />
            <h3>PresenterKit</h3>
          </div>

          {showOTPUI
            ? <div className={sty.authOTP}>
              <div className={sty.authOTPHeader}>
                <h2>Verification Code</h2>
                <h3>Please enter the code sent<br />to <strong>{email}</strong></h3>
              </div>

              <div className={sty.authApiErr}>
                <motion.h4 animate={apiErrAnim}>{apiErr}</motion.h4>
              </div>

              <div className={sty.authOTPInputs}>
                {Array(6).fill().map((_, i) => {
                  return <input
                    type='text'
                    style={{ color: groupCodeErr ? 'var(--red)' : 'var(--white)' }}
                    key={i}
                    ref={ref => codeInputRefs[i] = ref}
                    value={groupCode[i]}
                    onFocus={() => onFocus(i)}
                    onChange={(e) => onChangeText(e.target.value, i)}
                    onKeyDown={(e) => onKeyDown(e)}
                  />
                })}
              </div>

              <button className={sty.authBtn} onClick={() => verifyCode(groupCode.join(''))}>Verify</button>
            </div>
            : <>
              <Segment segments={segments} labels={labels} state={SSAuthUI.name} onChange={(index, segment) => onSegmentChange(segment)} />

              <div className={sty.authApiErr}>
                <motion.h4 animate={apiErrAnim}>{apiErr}</motion.h4>
              </div>

              <div className={sty.authInputs}>
                <AnimatePresence>
                  {SSAuthUI.name === 'SignUp' && <motion.div className={sty.authInput}
                    initial={{ height: 0, marginBottom: 0, opacity: 0 }}
                    animate={{ height: 40, marginBottom: 10, opacity: 1 }}
                    exit={{ height: 0, marginBottom: 0, opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                  >
                    <input name='username' placeholder='Username' type='text' value={username}
                      style={{ color: usernameErr ? 'var(--red)' : 'var(--white)' }}
                      onBlur={() => onBlur('username')}
                      onChange={(e) => onChange('username', e.target.value, setUsername)}
                    />
                    {usernameErr && <div className={sty.authInputIcon}>
                      <Icon name='alert-circle-o' size={20} color='--red' />
                      <div className='tooltip tooltipTop'>Invalid username</div>
                    </div>}
                  </motion.div>}
                </AnimatePresence>

                <div className={sty.authInput}>
                  <input name='email' placeholder='Email' type='email' value={email}
                    style={{ color: emailErr ? 'var(--red)' : 'var(--white)' }}
                    onBlur={() => onBlur('email')}
                    onChange={(e) => onChange('email', e.target.value, setEmail)}
                  />
                  {emailErr && <div className={sty.authInputIcon}>
                    <Icon name='alert-circle-o' size={20} color='--red' />
                    <div className='tooltip tooltipTop'>Invalid email</div>
                  </div>}
                </div>

                <div className={sty.authInput}>
                  <input name='password' placeholder='Password' type='password' value={password}
                    style={{ color: passErr ? 'var(--red)' : 'var(--white)', paddingRight: SSAuthUI.name !== 'SignUp' ? 30 : 10 }}
                    onBlur={() => onBlur('password')}
                    onChange={(e) => onChange('password', e.target.value, setPassword)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') SSAuthUI.name === 'SignIn' ? signIn() : signUp() }}
                  />
                  {SSAuthUI.name !== 'SignUp' && passErr && <div className={sty.authInputIcon}>
                    <Icon name='alert-circle-o' size={20} color='--red' />
                    <div className='tooltip tooltipTop'>Invalid password</div>
                  </div>}
                </div>

                <AnimatePresence>
                  {SSAuthUI.name === 'SignUp' && passErr && <motion.div className={sty.authPassErrs}
                    initial={{ height: 0, marginBottom: 0, opacity: 0 }}
                    animate={{ height: 25, marginBottom: 5, opacity: 1 }}
                    exit={{ height: 0, marginBottom: 0, opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                  >
                    <motion.div className={sty.authPassErr} style={{ backgroundColor: lowercaseErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                      <h4 style={{ color: lowercaseErr ? 'var(--red)' : 'var(--green)' }}>ab</h4>
                      {lowercaseErr && <div className='tooltip tooltipTop'>Add lowercase letter</div>}
                    </motion.div>
                    <div className={sty.authPassErr} style={{ backgroundColor: uppercaseErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                      <h4 style={{ color: uppercaseErr ? 'var(--red)' : 'var(--green)' }}>AB</h4>
                      {uppercaseErr && <div className='tooltip tooltipTop'>Add uppercase letter</div>}
                    </div>
                    <div className={sty.authPassErr} style={{ backgroundColor: digitErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                      <h4 style={{ color: digitErr ? 'var(--red)' : 'var(--green)' }}>12</h4>
                      {digitErr && <div className='tooltip tooltipTop'>Add digit</div>}
                    </div>
                    <div className={sty.authPassErr} style={{ backgroundColor: specCharErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                      <h4 style={{ color: specCharErr ? 'var(--red)' : 'var(--green)' }}>@#</h4>
                      {specCharErr && <div className='tooltip tooltipTop'>Add special character</div>}
                    </div>
                    <div className={sty.authPassErr} style={{ backgroundColor: passLengthErr ? 'var(--red-bg)' : 'var(--green-bg)' }}>
                      <h4 style={{ color: passLengthErr ? 'var(--red)' : 'var(--green)' }}>8+</h4>
                      {passLengthErr && <div className='tooltip tooltipTop'>{`Add minimum ${8 - password.length} character${password.length > 6 ? '' : 's'}`}</div>}
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>

              <button className={sty.authBtn} onClick={() => SSAuthUI.name === 'SignIn' ? signIn() : initiateSignUp()}>
                {STAuthUI.name === 'SignIn' ? 'Sign in' : 'Sign up'}
              </button>
            </>
          }
        </div>
        <div className={sty.authBanner}>
          <img src='/imgs/auth.webp' />
          <h2>Presentation and audience<br />engagement in one SaaS.</h2>
        </div>
      </div>
    </div>
  )
}