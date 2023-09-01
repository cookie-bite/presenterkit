import { useSnapshot } from 'valtio'
import { STScene, STApp } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Quests = () => {
    const sceneSnap = useSnapshot(STScene)


    return (
        <div className={sty.modalView}>
            <div className={sty.modal}>
                <div className={sty.modalHeader}>
                    <div className={sty.modalLblView}>
                        {sceneSnap.quests.length !== 0 && <div className={sty.modalCountBg}>
                            <h1 className={sty.modalCount}>{sceneSnap.quests.length}</h1>
                        </div>}
                        <h3 className={sty.modalHeaderLbl}>Messages</h3>
                    </div>
                    <button className={sty.modalHeadBtn} onClick={() => STApp.uiName = ''}>
                        <Icon name='close' size={20} color='--white' />
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
                    : <div className={sty.modalEmpty}>
                        <h3 className={sty.modalEmptyTtl}>No One Asked Yet</h3>
                        <h5 className={sty.modalEmptySbtl} onClick={() => STApp.uiName = ''}>Never afraid of being the first.</h5>
                    </div>
                }
            </div>
        </div>
    )
}