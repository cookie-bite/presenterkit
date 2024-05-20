import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STHost, STUI } from '../../stores/app.store'

import QRCode from 'react-qr-code'
import sty from '../../styles/modules/desktop.module.css'


export const QRScreen = () => {
    const [ssid, setSsid] = useState()
    const [pass, setPass] = useState()

    const ssidRef = useRef()
    const passRef = useRef()

    const SSHost = useSnapshot(STHost)
    const SSUI = useSnapshot(STUI)


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
                            <QRCode value={`http://${SSHost.ip}:${SSHost.port1}`} size={window.innerWidth / 5} bgColor={'#00000000'} fgColor={'#ffffff'} />
                        </div>
                        <div className={sty.qrInputs}>
                            <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Network name' value={ssid}
                                ref={ssidRef}
                                onChange={(e) => setSsid(e.target.value)}
                            />
                            <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Password' value={pass}
                                ref={passRef}
                                onChange={(e) => setPass(e.target.value)}
                            />
                        </div>
                        <h1 className={sty.qrLbl}>1. Connect Wi-Fi</h1>
                    </div>
                    <div className={sty.qr}>
                        <div className={sty.qrBg}>
                            <QRCode value={`http://${SSHost.ip}:${SSHost.port1}`} size={window.innerWidth / 5} bgColor={'#00000000'} fgColor={'#ffffff'} />
                        </div>
                        <h1 className={sty.qrLbl}>2. Enter App</h1>
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}