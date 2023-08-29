import { useSnapshot } from 'valtio'
import { Icon } from '../../components/core.cmp'
import { STApp } from '../../stores/app.store'

import sty from '../../styles/modules/mobile.module.css'


export const Shares = () => {
    const appSnap = useSnapshot(STApp)


    const closeShare = () => {
        STApp.showShare = false
        STApp.uiName = ''
    }


    return (
        appSnap.showShare
            ? <div className={sty.sharePreview}>
                <button className={sty.modalHeadBtn} style={{ position: 'fixed', top: 16, zIndex: 1 }} onClick={() => closeShare()}>
                    <Icon name='close' size={20} color='--white' />
                </button>
                <div className={sty.previewIc}>
                    <Icon name='notifications-o' size={30} color='--system-blue' />
                </div>
                {appSnap.shares[appSnap.activeShare].body && <div className={sty.previewBody}>
                    <h2 className={sty.previewBodyLbl} style={{ color: appSnap.shares[appSnap.activeShare].body ? 'var(--primary-label)' : 'var(--tertiary-label)' }}>{appSnap.shares[appSnap.activeShare].body}</h2>
                </div>}
                {appSnap.shares[appSnap.activeShare].urls[0].link && <div className={sty.previewBtns}>
                    {appSnap.shares[appSnap.activeShare].urls.map((url, index) => {
                        return (
                            <div className={sty.previewBtn} key={index}
                                style={{ border: `2px solid ${url.color}`, background: `linear-gradient(45deg, ${url.color}24, ${url.color}2B)` }}
                                onClick={() => window.open(url.link.match(/^https?:/) ? url.link : '//' + url.link, '_blank')}
                            >
                                <Icon name={url.name} size={24} color='--white' />
                            </div>
                        )
                    })}
                </div>}
            </div>
            : <div className={sty.modalView}>
                <div className={sty.modal}>
                    <div className={sty.modalHeader}>
                        <div className={sty.modalLblView}>
                            {appSnap.shares.length !== 0 && <div className={sty.modalCountBg}>
                                <h1 className={sty.modalCount}>{appSnap.shares.length}</h1>
                            </div>}
                            <h3 className={sty.modalHeaderLbl}>Shares</h3>
                        </div>
                        <button className={sty.modalHeadBtn} onClick={() => STApp.uiName = ''}>
                            <Icon name='close' size={20} color='--white' />
                        </button>
                    </div>
                    {appSnap.shares.length
                        ? <div className={sty.sharePages}>
                            {appSnap.shares.map((share, index) => {
                                return (
                                    <div key={index} className={sty.sharePage} onClick={() => { STApp.activeSlide.page = (index + 1) }}
                                        style={{ backgroundColor: appSnap.activeSlide.index === appSnap.playSlide.index && appSnap.activeSlide.page === index + 1 ? 'var(--system-yellow)' : 'var(--primary-fill)' }}>
                                        {share.body && <h2 className={sty.shareBody}>{share.body}</h2>}
                                        {share.urls[0].link && <div className={sty.shareBtns} style={{ marginTop: share.body ? 20 : 0 }}>
                                            {share.urls.map((url, index) => {
                                                return (
                                                    <div className={sty.shareBtn} key={index}
                                                        style={{ border: `2px solid ${url.color}`, background: `linear-gradient(45deg, ${url.color}24, ${url.color}2B)` }}
                                                        onClick={() => window.open(url.link.match(/^https?:/) ? url.link : '//' + url.link, '_blank')}
                                                    >
                                                        <Icon name={url.name} size={22} color='--white' />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        : <div className={sty.modalEmpty}>
                            <h3 className={sty.modalEmptyTtl}>No Info Shared</h3>
                            <h5 className={sty.modalEmptySbtl} onClick={() => STApp.uiName = ''}>Presenter could share soon.</h5>
                        </div>
                    }
                </div>
            </div>
    )
}