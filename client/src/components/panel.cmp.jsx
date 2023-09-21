import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STDesktop, STApp } from '../stores/app.store'
import { Icon } from './core.cmp'

import sty from '../styles/modules/desktop.module.css'


export const Panel = ({ children, show, label, count }) => {
    const desktopSnap = useSnapshot(STDesktop)

    const panelRef = useRef()

    const transition = {
        timeConstant: 100,
        modifyTarget: (target) => {
            const rectWidth = window.innerWidth - panelRef.current.getBoundingClientRect().width
            return target > rectWidth / 2 ? rectWidth - 40 : 0
        }
    }


    const changePos = (to) => {
        if (to !== STDesktop.panel.position) {
            STDesktop.panel.position = to
            localStorage.setItem('PANEL_POS', to)
        }
    }

    const onDragEnd = (event, info) => {
        setTimeout(() => {
            const panelRect = panelRef.current.getBoundingClientRect()
            changePos(panelRect.x + panelRect.width / 2 < window.innerWidth / 2 ? 'left' : 'right')
        }, 700)
    }


    return (
        <AnimatePresence>
            {show && <motion.div className={sty.panelView}
                ref={panelRef}
                initial={{ x: desktopSnap.panel.position === 'right' ? 'calc(100vw)' : 'calc(-100% - 40px)' }}
                exit={{ x: desktopSnap.panel.position === 'right' ? 'calc(100vw)' : 'calc(-100% - 40px)' }}
                animate={{ x: desktopSnap.panel.position === 'right' ? window.innerWidth - 340 : 0 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
                drag={'x'}
                dragElastic={1}
                dragTransition={transition}
                dragConstraints={{ bottom: 0, right: window.innerWidth }}
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
                        {/* <button className={sty.panelBtn} onClick={() => changePos(desktopSnap.panel.position === 'right' ? 'left' : 'right')}>
                            <Icon name={desktopSnap.panel.position === 'right' ? 'chevron-back' : 'chevron-forward'} size={20} color='--white' />
                        </button> */}
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