import { useSnapshot } from 'valtio'
import { STScreen } from '../stores/app.store'

import QRCode from 'react-qr-code'
import sty from '../styles/screen.module.css'


export const QRScreen = () => {
    const screenSnap = useSnapshot(STScreen)


    return (
        <div className={sty.qrView}>
            <h2 className={sty.qrLbl} style={{ fontSize: screenSnap.qr.expand ? 24 : 20, marginBottom: screenSnap.qr.expand ? 10 : 6 }}>Join chat</h2>
            <div className={sty.qrBg} style={{ padding: screenSnap.qr.expand ? 8 : 6, borderRadius: screenSnap.qr.expand ? 10 : 8 }} onClick={() => STScreen.qr.expand = !screenSnap.qr.expand}>
                <QRCode value={`http://${screenSnap.host.ip}:${screenSnap.host.port}`} size={screenSnap.qr.expand ? 200 : 120} bgColor={'#00000000'} fgColor={'#ffffff'} />
            </div>
        </div>
    )
}