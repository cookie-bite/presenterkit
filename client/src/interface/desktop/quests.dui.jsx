import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { STScene, STApp } from '../../stores/app.store'
import { Input, Panel } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Quests = ({ ws, core }) => {
    const sceneSnap = useSnapshot(STScene)
    const inputRef = useRef()


    const setDisplay = (quest, index) => {
        STScene.display = { quest: quest.label, author: quest.username }
        STScene.quests[index].effect = false
        ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STScene.display, index }))
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'Escape') STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


    return (
        <Panel label={'Questions'} count={sceneSnap.quests.length}>
            {sceneSnap.quests.length
                ? <div className={sty.questList}>
                    {sceneSnap.quests.map((quest, index) => {
                        return (
                            <div className={sty.questListItem} key={index} onClick={() => setDisplay(quest, index)}>
                                <h3 className={sty.questListItemSbtl}>{quest.username}</h3>
                                <h1 className={sty.questListItemTtl} style={{ color: quest.color, textShadow: quest.effect ? `0 0 10px ${quest.color}` : 'none' }}>{quest.label}</h1>
                            </div>
                        )
                    })}
                </div>
                : <div className={sty.panelEmpty}>
                    <h3 className={sty.panelEmptyTtl}>No One Asked Yet</h3>
                    <h5 className={sty.panelEmptySbtl} onClick={() => inputRef.current.focus()}>Never afraid of being the first.</h5>
                </div>
            }
            <Input innerRef={inputRef} ws={ws} core={core} />
        </Panel>
    )
}