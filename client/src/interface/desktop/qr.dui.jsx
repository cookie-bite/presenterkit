import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp, STDesktop } from '../../stores/app.store'

import QRCode from 'react-qr-code'
import sty from '../../styles/modules/desktop.module.css'


export const QRScreen = () => {
    const desktopSnap = useSnapshot(STDesktop)
    const appSnap = useSnapshot(STApp)


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape' && STApp.uiName === 'QRScreen') STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <AnimatePresence>
            {appSnap.uiName === 'QRScreen' && <motion.div className={sty.qrView}
                initial={{ x: desktopSnap.qr.expand ? 236 : 152 }}
                animate={{ x: 0 }}
                exit={{ x: desktopSnap.qr.expand ? 236 : 152 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
                {/* <h2 className={sty.qrLbl} style={{ fontSize: desktopSnap.qr.expand ? 24 : 20, marginBottom: desktopSnap.qr.expand ? 10 : 6 }}>Join chat</h2> */}
                <div className={sty.qrBg}
                    style={{ padding: desktopSnap.qr.expand ? 8 : 6, borderRadius: desktopSnap.qr.expand ? 10 : 8, cursor: desktopSnap.qr.expand ? 'zoom-out' : 'zoom-in' }}
                    onClick={() => STDesktop.qr.expand = !desktopSnap.qr.expand}
                >
                    <QRCode value={`http://${appSnap.host.ip}:${appSnap.host.port1}`} size={desktopSnap.qr.expand ? 200 : 120} bgColor={'#00000000'} fgColor={'#ffffff'} />
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}