import { useRef, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STScene, STUI } from '../stores/app.store'
import Lottie from 'lottie-web/build/player/lottie_light'
import sty from '../styles/ui.module.css'


const MDShare = ({ closeModal }) => {
    let anim = null
    const lottieRef = useRef(Lottie)

    const openLink = () => { window.open('https://telegram.me/datasciencework', '_blank'); closeModal() }

    useEffect(() => { STUI.menu.isActive = false; anim = Lottie.loadAnimation({ container: lottieRef.current, renderer: 'svg', loop: false, path: '/anims/telegram.json' }) }, [])


    return (
        <div className={sty.shareModal}>
            <button className={sty.cornerBtn} style={{ position: 'fixed' }} onClick={() => closeModal()}>
                <img className={sty.cornerBtnIc} src='/icons/close.svg' />
            </button>
            <div className={sty.modalTop}>
                <div className={sty.modalAnim} ref={lottieRef} onClick={() => anim.goToAndPlay(0)}></div>
                <h2 className={sty.modalLabel}>The Next Step</h2>
                <h5 className={sty.modalDesc}>Telegram</h5>
            </div>
            <div className={sty.modalBody}>
                <h3 className={sty.modalText}>Let's join us and discover your path.</h3>
            </div>
            <div className={sty.modalBottom}>
                <h6 className={sty.modalFootnote}>By joining the channel, you will get further information and guidelines.</h6>
                <button className={sty.modalBtn} onClick={() => openLink()}>Open</button>
            </div>
        </div>
    )
}


const MDQuest = ({ closeModal }) => {
    const sceneSnap = useSnapshot(STScene)


    return (
        <div className={sty.questModal}>
            <div className={sty.modalHeader}>
                <h3 className={sty.modalHeaderLabel}>Question List</h3>
                <button className={sty.cornerBtn} onClick={() => closeModal()}>
                    <img className={sty.cornerBtnIc} src='/icons/close.svg' />
                </button>
            </div>
            {sceneSnap.quests.length
                ? <div className={sty.questList}>
                    {sceneSnap.quests.map((quest, index) => {
                        return (
                            <div className={sty.questListItem} key={index}>
                                <h3 className={sty.questListItemSbtl}>{quest.username}</h3>
                                <h1 className={sty.questListItemTtl} style={{ color: quest.color, textShadow: quest.effect ? `0 0 10px ${quest.color}` : 'none' }}>{quest.label}</h1>
                            </div>
                        )
                    })}
                </div>
                : <div className={sty.questListEmpty}>
                    <h3 className={sty.questListEmptyTtl}>No One Asked Yet</h3>
                    <h5 className={sty.questListEmptySbtl} onClick={() => closeModal()}>Never afraid of being the first one.</h5>
                </div>
            }
        </div>
    )
}


const Modal = ({ share }) => {
    const closeModal = () => STApp.share = { isActive: false, data: {} }


    return (
        <div className={sty.modalView}>
            {share.text === 'SHARE' && <MDShare closeModal={closeModal} />}
            {share.text === 'QUEST' && <MDQuest closeModal={closeModal} />}
        </div>
    )
}


export const Share = () => {
    const appSnap = useSnapshot(STApp)


    return (
        appSnap.share.isActive && <Modal share={appSnap.share.data} />
    )
}