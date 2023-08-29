import { useSnapshot } from 'valtio'
import { STDesktop, STApp } from '../stores/app.store'
import { Icon } from './core.cmp'

import sty from '../styles/modules/desktop.module.css'


export const Panel = ({ children, label, count }) => {
    const desktopSnap = useSnapshot(STDesktop)


    const changePos = () => {
        STDesktop.panel.position = desktopSnap.panel.position === 'right' ? 'left' : 'right'
        localStorage.setItem('PANEL_POS', desktopSnap.panel.position === 'right' ? 'left' : 'right')
    }


    return (
        <div className={sty.panelView} style={{ [desktopSnap.panel.position]: 20 }}>
            <div className={sty.panelHeader}>
                <div className={sty.panelLblView}>
                    {count !== 0 && <div className={sty.panelCountBg}>
                        <h1 className={sty.panelCountLbl}>{count}</h1>
                    </div>}
                    <h1 className={sty.panelLbl}>{label}</h1>
                </div>
                <div className={sty.panelBtns}>
                    <button className={sty.panelBtn} onClick={() => changePos()}>
                        <Icon name={desktopSnap.panel.position === 'right' ? 'chevron-back' : 'chevron-forward' } size={20} color='--white' />
                    </button>
                    <button className={sty.panelBtn} style={{ marginLeft: 10 }} onClick={() => STApp.uiName = ''}>
                        <Icon name='close' size={20} color='--white' />
                    </button>
                </div>
            </div>
            {children}
        </div>
    )
}