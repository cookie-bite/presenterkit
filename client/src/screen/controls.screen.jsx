import { useSnapshot } from 'valtio'
import { STScreen } from '../stores/app.store'

import sty from '../styles/screen.module.css'


export const Controls = () => {
    const screenSnap = useSnapshot(STScreen)

    const openScreen = (screen) => STScreen.uiName = STScreen.uiName === screen ? '' : screen

    const resizeWindow = () => {
        if (screenSnap.controls.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STScreen.controls.isFullscreen = !screenSnap.controls.isFullscreen
    }
    

    return (
        <div className={sty.screenBtns}>
            <button className={sty.screenBtn} onClick={() => openScreen('QRScreen')}>
                <img className={sty.screenBtnIc} style={{ width: 26, height: 26 }} src={'/icons/qr-o.svg'} />
            </button>
            <button className={sty.screenBtn} onClick={() => openScreen('QuestsPanel')}>
                <img className={sty.screenBtnIc} src={'/icons/chatbubble-o.svg'} />
            </button>
            <button className={sty.screenBtn} onClick={() => openScreen('UsersPanel')}>
                <img className={sty.screenBtnIc} src={'/icons/people.svg'} />
            </button>
            <button className={sty.screenBtn} onClick={() => resizeWindow()}>
                <img className={sty.screenBtnIc} src={`/icons/${screenSnap.controls.isFullscreen ? 'contract' : 'expand'}.svg`} />
            </button>
            <button className={sty.screenBtn} onClick={() => STScreen.controls.isActive = false}>
                <img className={sty.screenBtnIc} src={'/icons/close.svg'} />
            </button>
        </div>
    )
}