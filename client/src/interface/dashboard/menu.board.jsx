import { useSnapshot } from 'valtio'

import { Icon } from '../../components/core.cmp'
import { STBoardUI } from '../../stores/app.store'

import sty from '../../styles/modules/dashboard.module.css'


export const Menu = () => {
    const SSBoardUI = useSnapshot(STBoardUI)


    return (
        <div className={sty.menu}>
            <div className={sty.menuLogo}>
                <img src='/logo.svg' alt='logo' />
                <h3>PresenterKit</h3>
            </div>

            <div className={sty.menuNav}>
                <div className={sty.menuNavList}>
                    <button className={SSBoardUI.name === 'Events' ? sty.menuNavListItemActive : sty.menuNavListItem}
                        onClick={() => STBoardUI.name = 'Events'}
                    >
                        <Icon name='ticket-o' size={24} color='--white' />
                        <h3 className={sty.menuNavListItemLbl}>Events</h3>
                    </button>
                    <button className={SSBoardUI.name === 'Payments' ? sty.menuNavListItemActive : sty.menuNavListItem}
                        onClick={() => STBoardUI.name = 'Payments'}
                    >
                        <Icon name='card-o' size={24} color='--white' />
                        <h3 className={sty.menuNavListItemLbl}>Payments</h3>
                    </button>
                </div>
            </div>
        </div>
    )
}