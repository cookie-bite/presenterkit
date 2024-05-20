import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STPanel, STUI } from '../../stores/app.store'

import { Icon } from '../core.cmp'

import sty from './panel.module.css'


export const Panel = ({ children, show, label, count }) => {
    const SSPanel = useSnapshot(STPanel)

    const panelRef = useRef()

    const transition = {
        timeConstant: 100,
        modifyTarget: (target) => {
            const rectWidth = window.innerWidth - panelRef.current.getBoundingClientRect().width
            return target > rectWidth / 2 ? rectWidth - 40 : 0
        }
    }


    const changePos = (to) => {
        if (to !== STPanel.position) {
            STPanel.position = to
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
                initial={{ x: SSPanel.position === 'right' ? 'calc(100vw)' : 'calc(-100% - 40px)' }}
                exit={{ x: SSPanel.position === 'right' ? 'calc(100vw)' : 'calc(-100% - 40px)' }}
                animate={{ x: SSPanel.position === 'right' ? window.innerWidth - 340 : 0 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
                drag={'x'}
                dragElastic={1}
                dragTransition={transition}
                dragConstraints={{ bottom: 0, right: window.innerWidth }}
                onDragEnd={(event, info) => onDragEnd(event, info)}
            >
                <div className={sty.panelHeader}>
                    <div className={sty.panelLblView}>
                        {count && count !== 0 && <div className={sty.panelCountBg}>
                            <h1 className={sty.panelCountLbl}>{count}</h1>
                        </div>}
                        <h1 className={sty.panelLbl}>{label}</h1>
                    </div>
                    <div className={sty.panelBtns}>
                        <button className={sty.panelBtn} style={{ marginLeft: 10 }} onClick={() => STUI.name = ''}>
                            <Icon name='close' size={20} color='--white' />
                        </button>
                    </div>
                </div>
                {children}
            </motion.div>}
        </AnimatePresence>
    )
}