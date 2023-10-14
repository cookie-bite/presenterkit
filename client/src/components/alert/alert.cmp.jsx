import { proxy, useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../core.cmp'
import { getColor } from '../../utilities/core.utils'

import sty from './alert.module.css'


const STAlert = proxy({
    icon: {},
    title: '',
    subtitle: '',
    buttons: [],
    show: false
})


const show = ({ icon, title, subtitle, buttons, duration } = {}) => {
    duration = duration || ((title.length) * 110) + (Number(Boolean(icon)) * 1300) + (Number(Boolean(buttons)) * 1700)
    const delay = 500
    STAlert.show = false

    STAlert.icon = icon
    STAlert.title = title
    STAlert.subtitle = subtitle
    STAlert.buttons = buttons
    setTimeout(() => STAlert.show = true, delay)

    setTimeout(() => STAlert.show = false, duration + delay)
}


const Container = () => {
    const alertSnap = useSnapshot(STAlert)


    const handleOnClick = (onClick) => {
        onClick()
        STAlert.show = false
    }


    return (
        <AnimatePresence mode='wait'>
            {alertSnap.show && <motion.div className={sty.alert}
                initial={{ y: '-100%', x: '-50%' }}
                animate={{ y: 21, x: '-50%' }}
                exit={{ y: '-100%', x: '-50%' }}
                transition={{ ease: 'easeInOut', duration: 0.5 }}
            >
                {alertSnap.icon && <div className={sty.alertIc} style={{ backgroundColor: `${getColor(alertSnap.icon.color || '--primary-tint')}27` }}>
                    <Icon name={alertSnap.icon.name || 'notifications'} size={alertSnap.icon.size || 26} color={alertSnap.icon.color || '--primary-tint'} />
                </div>}
                <div className={sty.alertBody} style={{ marginLeft: alertSnap.icon ? 20 : 10, marginRight: alertSnap.buttons ? 20 : 10 }}>
                    <h4 className={sty.alertTtl}>{alertSnap.title}</h4>
                    <h5 className={sty.alertSbtl}>{alertSnap.subtitle}</h5>
                </div>
                {alertSnap.buttons && <div className={sty.alertBtns}>
                    {alertSnap.buttons.map((btn, index) => {
                        return (
                            <button className={sty.alertBtn} onClick={() => handleOnClick(btn.onClick)} key={index}>{btn.label}</button>
                        )
                    })}
                </div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export const Alert = { Container, show }