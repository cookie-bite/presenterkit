import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STHost, STUI } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import QRCode from 'react-qr-code'
import sty from '../../styles/modules/desktop.module.css'


export const QRScreen = () => {
    const [ssid, setSsid] = useState('')
    const [pass, setPass] = useState('')

    const SSHost = useSnapshot(STHost)
    const SSUI = useSnapshot(STUI)


    const changeIP = () => {
        STHost.ip = STHost.all.at(STHost.all.indexOf(STHost.ip) + 1 - STHost.all.length)
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape' && STUI.name === 'QRScreen') STUI.name = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <AnimatePresence>
            {SSUI.name === 'QRScreen' && <motion.div className={sty.pageView}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
                <div className={sty.qrView}>
                    <div className={sty.qr}>
                        <div className={sty.qrBg}>
                            <QRCode value={`WIFI:T:WPA;S:${ssid};P:${pass};H:;;`} size={Math.round(window.innerWidth / 5)} bgColor={'#00000000'} fgColor={'#ffffff'} />
                        </div>
                        <h1 className={sty.qrLbl}>1. Connect Wi-Fi</h1>
                        <div className={sty.qrForm}>
                            <div className={sty.qrLbls}>
                                <h3 className={sty.qrInputLbl}>Network Name:</h3>
                                <h3 className={sty.qrInputLbl}>Password:</h3>
                            </div>
                            <div className={sty.qrInputs}>
                                <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Network name' value={ssid} onChange={(e) => setSsid(e.target.value)} />
                                <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className={sty.qr}>
                        <div className={sty.qrBg}>
                            <QRCode value={`http://${SSHost.ip}:${SSHost.port1}`} size={Math.round(window.innerWidth / 5)} bgColor={'#00000000'} fgColor={'#ffffff'} />
                        </div>
                        <h1 className={sty.qrLbl} style={{ animationDelay: '1.5s' }}>2. Enter App</h1>
                        <div className={sty.qrForm}>
                            <div className={sty.qrLbls}>
                                <h3 className={sty.qrInputLbl}>URL:</h3>
                                <h3 className={sty.qrInputLbl}>IP:</h3>
                            </div>
                            <div className={sty.qrInputs}>
                                <div className={sty.qrHost}>
                                    <h3 className={sty.qrHostLbl}>{`http://${SSHost.ip}:${SSHost.port1}`}</h3>
                                </div>
                                <div className={sty.qrHost}>
                                    <h3 className={sty.qrHostLbl}>{SSHost.ip}</h3>
                                    {SSHost.all.length > 1 && <div className={sty.qrHostIcon} onClick={() => changeIP()}>
                                        <Icon name='sync' size={22} color={'--system-blue'} />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}