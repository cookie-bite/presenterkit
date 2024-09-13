import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'

import { STUI, STUser } from '../../stores/app.store'
import { STAdmin, STTab } from '../../stores/admin.store'

import sty from '../../styles/modules/admin.module.css'

import { Header } from './header.admin'
import { Messages } from './messages.admin'
import { Shares } from './shares.admin'


const UISwap = (props) => {
    const SSTab = useSnapshot(STTab)
    return props.children.filter(c => c.props.uiName === SSTab.name)
}


export const Admin = ({ ws, core }) => {
    const SSAdmin = useSnapshot(STAdmin)
    const SSUser = useSnapshot(STUser)
    const SSUI = useSnapshot(STUI)


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STUI.name = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <AnimatePresence>
            {(SSUI.name === 'Admin' && !core.isMobile) && (SSUser.isPresenter || SSAdmin.privileged) &&
                <motion.div className={sty.pageView}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                >
                    <Header ws={ws} core={core} />
                    <UISwap>
                        <Messages ws={ws} uiName={'Messages'} />
                        <Shares ws={ws} uiName={'Shares'} />
                    </UISwap>
                </motion.div>}
        </AnimatePresence>
    )
}