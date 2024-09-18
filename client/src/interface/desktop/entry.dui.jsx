import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STUser, STEntry, STCooldown, STEvent } from '../../stores/app.store'
import { RTAuth } from '../../routes/routes'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Entry = ({ ws }) => {
    const SSUser = useSnapshot(STUser)
    const SSCooldown = useSnapshot(STCooldown)

    const inputAnim = useAnimation()

    const [username, setUsername] = useState('')


    const joinRoom = async () => {
        const interval = setInterval(async () => {
            if (ws.readyState === 1) {
                clearInterval(interval)

                if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

                ws.send(JSON.stringify({ command: 'JOIN_ROOM', eventID: STEvent.id ? STEvent.id : localStorage.getItem('eventID'), userID: localStorage.getItem('userID'), token: localStorage.getItem('ACS_TKN') }))
            }
        }, 10)
    }

    const enterRoom = () => {
        if (username === '') { return inputAnim.start({ x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0] }) }

        ws.send(JSON.stringify({ command: 'SET_USER', eventID: STEvent.id, username, roomActivity: 'joined' }))
        STEntry.show = false
        STUser.name = username
        setUsername('')
    }


    useEffect(() => {
        if (!STCooldown.active) joinRoom()
        const cldw = +localStorage.getItem('CLDW')

        if (cldw && cldw > Date.now()) {
            STCooldown.active = true
            STCooldown.count = Math.ceil((cldw - Date.now()) / (1000 * 60))

            const interval = setInterval(() => {
                const time = Math.ceil((cldw - Date.now()) / (1000 * 60))

                console.clear()
                console.log(Math.ceil((cldw - Date.now()) / (1000)))

                if (time === 0) {
                    clearInterval(interval)
                    if (STUser.name) STEntry.show = false
                    else STCooldown.active = false
                } else if (STCooldown.count !== time) STCooldown.count = time

            }, 1000)
        }
    }, [])


    return (
        <motion.div className={sty.entryPage}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: SSUser.isPresenter ? 0 : 0.5 }}
        >
            {SSCooldown.active
                ? <motion.div className={sty.cooldown}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                >
                    <div className={sty.cooldownIc}>
                        <Icon name='timer-o' size={30} color='--system-red' />
                    </div>
                    <div className={sty.cooldownLbl}>
                        <h1 className={sty.cooldownTtl}>Temporary Cooldown</h1>
                        <h3 className={sty.cooldownSbtl}>for inappropriate action</h3>
                    </div>
                    <h2 className={sty.cooldownTimer}>{SSCooldown.count} min</h2>
                </motion.div>
                : <motion.div className={sty.entryView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: 'easeInOut', duration: 0.5, delay: 0.2 }}
                >
                    <h1 className={sty.entryLogo}>PresenterKit</h1>
                    <div className={sty.entryInputView}>
                        <motion.input className={sty.entryInput} placeholder='Username' value={username} autoFocus={true} animate={inputAnim}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') enterRoom() }}
                        />
                        <button className={sty.entryInputBtn} onClick={() => enterRoom()}>
                            <Icon name='arrow-forward-circle-o' size={28} color='--system-blue' />
                        </button>
                    </div>
                </motion.div>
            }
        </motion.div>
    )
}