import { motion } from 'framer-motion'
import { Icon } from '../../components/core.cmp'
import { useSnapshot } from 'valtio'
import { STApp, STUI, STUser } from '../../stores/app.store'
import { STAdmin } from '../../stores/admin.store'

import sty from '../../styles/modules/desktop.module.css'


export const Controls = () => {
    const SSUI = useSnapshot(STUI)
    const SSUser= useSnapshot(STUser)
    const SSApp = useSnapshot(STApp)
    const SSAdmin = useSnapshot(STAdmin)


    const toggleScreen = (screen) => {
        STUI.name = SSUI.name === screen ? '' : screen
    }

    const resizeWindow = () => {
        if (STApp.isFullscreen) {
            if (document.exitFullscreen) { document.exitFullscreen() }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
        } else {
            if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen() }
            else if (document.documentElement.webkitEnterFullscreen) { document.documentElement.webkitEnterFullscreen() }
        }

        STApp.isFullscreen = !STApp.isFullscreen
    }

    const cmpr = (screen) => {
        return SSUI.name === screen
    }


    return (
        <div className={sty.controlsHitSlop}>
            <motion.div className={sty.controls}
                initial={{ y: 15 }}
                animate={{ y: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.5, delay: 0.8 }}
            >
                {SSUser.isPresenter && <button className={sty[cmpr('Remote') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Remote')}>
                    <Icon name='phone-o' size={28} color={cmpr('Remote') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Remote</div>
                </button>}
                <button className={sty[cmpr('QRScreen') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('QRScreen')}>
                    <Icon name='qr' size={26} color={cmpr('QRScreen') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>QR</div>
                </button>
                <button className={sty[cmpr('Quests') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Quests')}>
                    <Icon name='chatbubble-o' size={30} color={cmpr('Quests') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Messages</div>
                </button>
                <button className={sty[cmpr('Users') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Users')}>
                    <Icon name='people' size={30} color={cmpr('Users') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Users</div>
                </button>
                {!SSUser.isPresenter && <button className={sty[cmpr('Shares') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Shares')}>
                    <Icon name='paper-plane' size={26} color={cmpr('Shares') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Shares</div>
                </button>}
                {SSUser.isPresenter && <button className={sty[cmpr('Presenter') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Presenter')}>
                    <Icon name='albums' size={30} color={cmpr('Presenter') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Presenter</div>
                </button>}
                {!SSUser.isPresenter && <button className={sty[cmpr('Slides') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Slides')}>
                    <Icon name='albums' size={30} color={cmpr('Slides') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Slides</div>
                </button>}
                {(SSUser.isPresenter || SSAdmin.privileged) && <button className={sty[cmpr('Admin') ? 'controlsBtnActive' : 'controlsBtn']} onClick={() => toggleScreen('Admin')}>
                    <Icon name='person-circle-o' size={33} color={cmpr('Admin') ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>Admin</div>
                </button>}
                {!SSUser.isPresenter && <button className={sty.controlsBtn} onClick={() => resizeWindow()}>
                    <Icon name={SSApp.isFullscreen ? 'contract' : 'expand'} size={30} color={SSApp.isFullscreen ? '--white' : '--secondary-label'} />
                    <div className='tooltip tooltipTop'>{SSApp.isFullscreen ? 'Exit' : 'Full screen'}</div>
                </button>}
            </motion.div>
        </div>
    )
}