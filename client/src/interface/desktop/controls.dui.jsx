import { Icon } from '../../components/core.cmp'
import { useSnapshot } from 'valtio'
import { STAdmin, STDesktop, STApp } from '../../stores/app.store'

import sty from '../../styles/modules/desktop.module.css'


export const Controls = ({ core }) => {
    const adminSnap = useSnapshot(STAdmin)
    const appSnap = useSnapshot(STApp)
    

    const toggleScreen = (screen) => {
        STApp.uiName = appSnap.uiName === screen ? '' : screen
    }

    const resizeWindow = () => {
        if (appSnap.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STApp.isFullscreen = !appSnap.isFullscreen
    }

    const cmpr = (screen) => {
        return appSnap.uiName === screen
    }


    return (
        <div className={sty.screenBtns}>
            {core.isPresenter && <button className={sty[cmpr('Remote') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Remote')}>
                <Icon name='phone-o' size={28} color={cmpr('Remote') ? '--black' : '--white' }/>
            </button>}
            <button className={sty[cmpr('QRScreen') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('QRScreen')}>
                <Icon name='qr' size={26} color={cmpr('QRScreen') ? '--black' : '--white' }/>
            </button>
            <button className={sty[cmpr('Quests') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Quests')}>
                <Icon name='chatbubble-o' size={30} color={cmpr('Quests') ? '--black' : '--white' }/>
            </button>
            <button className={sty[cmpr('Users') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Users')}>
                <Icon name='people' size={30} color={cmpr('Users') ? '--black' : '--white' }/>
            </button>
            {core.isPresenter && <button className={sty[cmpr('Presenter') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Presenter')}>
                <Icon name='albums' size={30} color={cmpr('Presenter') ? appSnap.showTheatre ? '--system-purple' : '--black' : '--white' }/>
            </button>}
            {!core.isPresenter && <button className={sty[cmpr('Slides') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Slides')}>
                <Icon name='albums' size={30} color={cmpr('Slides') ? appSnap.showTheatre ? '--system-purple' : '--black' : '--white' }/>
            </button>}
            {(core.isPresenter || adminSnap.isAdmin) && <button className={sty[cmpr('Admin') ? 'screenBtnActive' : 'screenBtn']} onClick={() => toggleScreen('Admin')}>
                <Icon name='person-circle-o' size={33} color={cmpr('Admin') ? '--black' : '--white' }/>
            </button>}
            {!core.isPresenter && <button className={sty.screenBtn} onClick={() => resizeWindow()}>
                <Icon name={appSnap.isFullscreen ? 'contract' : 'expand'} size={30} color='--white'/>
            </button>}
            <button className={sty.screenBtn} onClick={() => STDesktop.controls.isActive = false}>
                <Icon name='close' size={30} color='--system-red'/>
            </button>
        </div>
    )
}