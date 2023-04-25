import { useSnapshot } from 'valtio'
import { STAdmin } from '../stores/app.store'
import sty from '../styles/admin.module.css'


export const Header = () => {
    const pages = ['Queue', 'Display', 'Share']

    const adminSnap = useSnapshot(STAdmin)

    const navigate = (page) => STAdmin.uiName = page


    return (
        <div className={sty.headerView}>
            {pages.map((page, index) => {
                return (
                    <button className={sty.headerButton} style={adminSnap.uiName === page ? { backgroundColor: 'var(--tertiary-fill)' } : null} onClick={() => navigate(page)} key={index}>
                        <h3 className={sty.headerLabel} style={adminSnap.uiName === page ? { color: 'var(--secondary-label)' } : null}>{page}</h3>
                    </button>
                )
            })}
        </div>
    )
}