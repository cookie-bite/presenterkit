import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STDesktop, STApp } from '../stores/app.store'
import { Icon } from './core.cmp'

import sty from '../styles/modules/desktop.module.css'


export const Panel = ({ children, show, label, count }) => {
    const desktopSnap = useSnapshot(STDesktop)


    const changePos = () => {
        STDesktop.panel.position = desktopSnap.panel.position === 'right' ? 'left' : 'right'
        localStorage.setItem('PANEL_POS', desktopSnap.panel.position === 'right' ? 'left' : 'right')
    }

    const onDragEnd = (event, info) => {
        if (Math.abs(info.offset.x) > (window.innerWidth - 300) / 2) changePos()
    }


    return (
        <AnimatePresence>
            {show && <motion.div className={sty.panelView}
                style={{ [desktopSnap.panel.position]: 20 }}
                initial={{ x: desktopSnap.panel.position === 'right' ? 'calc(100% + 20px)' : 'calc(-100% - 20px)' }}
                animate={{ x: 0 }}
                exit={{ x: desktopSnap.panel.position === 'right' ? 'calc(100% + 20px)' : 'calc(-100% - 20px)' }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
                drag={true}
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(event, info) => onDragEnd(event, info)}
            >
                <div className={sty.panelHeader}>
                    <div className={sty.panelLblView}>
                        {count !== 0 && <div className={sty.panelCountBg}>
                            <h1 className={sty.panelCountLbl}>{count}</h1>
                        </div>}
                        <h1 className={sty.panelLbl}>{label}</h1>
                    </div>
                    <div className={sty.panelBtns}>
                        <button className={sty.panelBtn} onClick={() => changePos()}>
                            <Icon name={desktopSnap.panel.position === 'right' ? 'chevron-back' : 'chevron-forward'} size={20} color='--white' />
                        </button>
                        <button className={sty.panelBtn} style={{ marginLeft: 10 }} onClick={() => STApp.uiName = ''}>
                            <Icon name='close' size={20} color='--white' />
                        </button>
                    </div>
                </div>
                {children}
            </motion.div>}
        </AnimatePresence>
    )
}