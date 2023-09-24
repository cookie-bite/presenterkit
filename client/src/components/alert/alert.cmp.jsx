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
    showAlert: false
})


const show = ({ icon, title, subtitle, buttons, duration = 3000 } = {}) => {
    // duration = ((title.length + subtitle.length) * 110)
    STAlert.icon = icon
    STAlert.title = title
    STAlert.subtitle = subtitle
    STAlert.buttons = buttons
    STAlert.showAlert = true
    if (duration) setTimeout(() => STAlert.showAlert = false, duration)
}


const Container = () => {
    const alertSnap = useSnapshot(STAlert)


    return (
        <AnimatePresence>
            {alertSnap.showAlert && <motion.div className={sty.alert}
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
                            <button className={sty.alertBtn} onClick={btn.onClick} key={index}>{btn.label}</button>
                        )
                    })}
                </div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export const Alert = { Container, show }