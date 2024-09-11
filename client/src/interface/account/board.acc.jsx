import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTAuth, RTEvent } from '../../routes/routes'
import { STAccountUI, STEvent } from '../../stores/app.store'

import sty from '../../styles/modules/account.module.css'
import { goTo } from '../../components/core.cmp'


export const Board = () => {
    const SSAccountUI = useSnapshot(STAccountUI)

    const [eventName, setEventName] = useState('')


    const onChange = (value, set) => {
        set(value)
    }

    const create = () => {
        RTEvent.create(eventName).then((data) => {
            if (data.success) {
                STEvent.id = data.event.id
                STEvent.name = data.event.name
                goTo(`/event?id=${STEvent.id}`)
            }
        })
    }


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
        <>
            <h1>{localStorage.getItem('EMAIL')}</h1>
            {SSAccountUI.name === 'Board' && <button className={sty.menuBtn} onClick={() => signOut()} style={{ backgroundColor: 'var(--system-red)' }}>Sign out</button>}
            <br/>
            <input className={sty.menuInput} style={{ marginTop: 15 }} name='eventName' placeholder='Event name' type='text' value={eventName} onChange={(e) => onChange(e.target.value, setEventName)} />
            <button className={sty.menuBtn} onClick={() => create()}>Create</button>
        </>
    )
}