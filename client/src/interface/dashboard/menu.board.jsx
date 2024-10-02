import { useSnapshot } from 'valtio'

import { RTAuth } from '../../routes/routes'
import { goTo, Icon } from '../../components/core.cmp'
import { STBoardUI, STUser } from '../../stores/app.store'

import sty from '../../styles/modules/dashboard.module.css'


export const Menu = () => {
    const SSBoardUI = useSnapshot(STBoardUI)
    const SSUser = useSnapshot(STUser)


    const signOut = () => {
        RTAuth.signOut().then((data) => {
            if (data.success) {
                localStorage.removeItem('EMAIL')
                localStorage.removeItem('ACS_TKN')
                localStorage.removeItem('RFS_TKN')
                localStorage.removeItem('SIGNED_IN')
                goTo('/auth')
            }
        })
    }


    return (
        <div className={sty.menu}>
            <div className={sty.menuLogo}>
                <img src='/logo.svg' alt='logo' />
                <h3>PresenterKit</h3>
            </div>

            <div className={sty.menuList}>
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

                <div className={sty.profile}>
                    <div className={sty.user}>
                        <Icon name='person-circle-o' size={46} color='--gray-1' />
                        <div className={sty.info}>
                            <h2 className={sty.username}>{SSUser.name}</h2>
                            <h4 className={sty.email}>{localStorage.getItem('EMAIL')}</h4>
                        </div>
                    </div>
                    <button className={sty.exitBtn} onClick={() => signOut()}>
                        <Icon name='exit-o' size={24} color='--red' style={{ marginRight: 5 }} />Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}