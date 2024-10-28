import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Icon } from '../../components/core.cmp'
import { STUI, STShare, STShares, STSlide } from '../../stores/app.store'

import sty from '../../styles/modules/mobile.module.css'


export const Shares = () => {
    const SSUI = useSnapshot(STUI)
    const SSShare = useSnapshot(STShare)
    const SSShares = useSnapshot(STShares)
    const SSSlide = useSnapshot(STSlide)


    const closeShare = () => {
        STShare.show = false
        STUI.name = ''
    }


    return (
        <AnimatePresence mode='wait'>
            {SSUI.name === 'Shares' && <>
                {SSShare.show && <motion.div className={sty.sharePreview}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                >
                    <button className={sty.modalHeadBtn} style={{ position: 'fixed', top: 16, zIndex: 1 }} onClick={() => closeShare()}>
                        <Icon name='close' size={20} color='--white' />
                    </button>
                    <button className={sty.previewIc} onClick={() => STShare.show = false}>
                        <Icon name='notifications-o' size={30} color='--blue' />
                    </button>
                    {SSShares.list[SSShare.active].body && <div className={sty.previewBody}>
                        <h2 className={sty.previewBodyLbl} style={{ color: SSShares.list[SSShare.active].body ? 'var(--label-1)' : 'var(--label-3)' }}>{SSShares.list[SSShare.active].body}</h2>
                    </div>}
                    {SSShares.list[SSShare.active].urls[0].link && <div className={sty.previewBtns}>
                        {SSShares.list[SSShare.active].urls.map((url, index) => {
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
                </motion.div>}
                {!SSShare.show && <motion.div className={sty.modalView}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                >
                    <div className={sty.modal}>
                        <div className={sty.modalHeader}>
                            <div className={sty.modalLblView}>
                                {SSShares.list.length !== 0 && <div className={sty.modalCountBg}>
                                    <h1 className={sty.modalCount}>{SSShares.list.length}</h1>
                                </div>}
                                <h3 className={sty.modalHeaderLbl}>Shares</h3>
                            </div>
                            <button className={sty.modalHeadBtn} onClick={() => STUI.name = ''}>
                                <Icon name='close' size={20} color='--white' />
                            </button>
                        </div>
                        {SSShares.list.length
                            ? <div className={sty.sharePages}>
                                {SSShares.list.map((share, index) => {
                                    return (
                                        <div key={index} className={sty.sharePage}>
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
                                <h5 className={sty.modalEmptySbtl} onClick={() => STUI.name = ''}>Presenter could share soon.</h5>
                            </div>
                        }
                    </div>
                </motion.div>}
            </>}
        </AnimatePresence>
    )
}