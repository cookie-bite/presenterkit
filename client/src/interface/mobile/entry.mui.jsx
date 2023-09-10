import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Entry = ({ ws, core }) => {
    const appSnap = useSnapshot(STApp)
    const [username, setUsername] = useState('')


    const joinRoom = () => {
        setTimeout(() => ws.send(JSON.stringify({ command: 'JOIN_ROOM', isPresenter: core.isPresenter, roomActivity: 'in lobby' })), 500)
    }

    const enterRoom = () => {
        ws.send(JSON.stringify({ command: 'SET_USER', room: STApp.userRoom, username, roomActivity: 'joined' }))
        STApp.showEntry = false
        STApp.username = username
        setUsername('')
    }


    useEffect(() => {
        if (!appSnap.hasCooldown) joinRoom()
        const cldw = +localStorage.getItem('CLDW')

        if (cldw && cldw > Date.now()) {
            STApp.hasCooldown = true
            STApp.cooldown = Math.ceil((cldw - Date.now()) / (1000 * 60))

            const interval = setInterval(() => {
                const time = Math.ceil((cldw - Date.now()) / (1000 * 60))

                console.clear()
                console.log(Math.ceil((cldw - Date.now()) / (1000)))

                if (time === 0) {
                    clearInterval(interval)
                    if (appSnap.username) STApp.showEntry = false
                    else STApp.hasCooldown = false
                } else if (appSnap.cooldown !== time) STApp.cooldown = time

            }, 1000)
        }
    }, [])


    return (
        <motion.div className={sty.entryPage}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.5, delay: 0.4 }}
        >
            {appSnap.hasCooldown
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
                    <h2 className={sty.cooldownTimer}>{appSnap.cooldown} min</h2>
                </motion.div>
                : <motion.div className={sty.entryView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: 'easeInOut', duration: 0.5, delay: 0.2 }}
                >
                    <h1 className={sty.entryLogo}>SeeQuest</h1>
                    <div className={sty.entryInputView}>
                        <input className={sty.entryInput} autoFocus={true} placeholder='Username' value={username}
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