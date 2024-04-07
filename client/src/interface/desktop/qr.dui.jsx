import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STHost, STQR, STUI } from '../../stores/app.store'

import QRCode from 'react-qr-code'
import sty from '../../styles/modules/desktop.module.css'


export const QRScreen = () => {
    const SSHost = useSnapshot(STHost)
    const SSUI = useSnapshot(STUI)
    const SSQR= useSnapshot(STQR)


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape' && STUI.name === 'QRScreen') STUI.name = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <AnimatePresence>
            {SSUI.name === 'QRScreen' && <motion.div className={sty.qrView}
                initial={{ x: SSQR.expand ? 236 : 152 }}
                animate={{ x: 0 }}
                exit={{ x: SSQR.expand ? 236 : 152 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
                <div className={sty.qrBg}
                    style={{ padding: SSQR.expand ? 8 : 6, borderRadius: SSQR.expand ? 10 : 8, cursor: SSQR.expand ? 'zoom-out' : 'zoom-in' }}
                    onClick={() => STQR.expand = !SSQR.expand}
                >
                    <QRCode value={`http://${SSHost.ip}:${SSHost.port1}`} size={SSQR.expand ? 200 : 120} bgColor={'#00000000'} fgColor={'#ffffff'} />
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}