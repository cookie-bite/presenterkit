import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTAuth, RTEvent, RTUser } from '../../routes/routes'
import { STEvent, STUser } from '../../stores/app.store'
import { goTo } from '../../components/core.cmp'

import sty from '../../styles/modules/account.module.css'


export const Dashboard = () => {
    const [eventName, setEventName] = useState('')

    const SSUser = useSnapshot(STUser)


    const onChange = (value, set) => {
        set(value)
    }

    const create = () => {
        RTEvent.create(eventName).then((data) => {
            if (data.success) {
                STUser.events.push({ eventID: data.event.id, name: data.event.name })
            }
        })
    }

    const joinEvent = (eventID) => {
        window.open(`${process.env.REACT_APP_APP_URL}/event?id=${eventID}`, '_blank')
    }

    const deleteBy = (eventID) => {
        RTEvent.deleteBy(eventID).then((data) => {
            if (data.success) STUser.events = STUser.events.filter((e) => e.eventID !== eventID)
        })
    }

    const getData = () => {
        RTUser.getData().then((data) => {
            if (data.success) {
                STUser.name = data.user.username
                STUser.events = data.user.events
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


    useEffect(() => getData(), [STEvent])


    return (
        <div>
            <h2>{localStorage.getItem('EMAIL')}</h2>
            <h3>{SSUser.name}</h3>
            <button className={sty.menuBtn} onClick={() => signOut()} style={{ backgroundColor: 'var(--system-red)' }}>Sign out</button>
            <br />
            <input className={sty.menuInput} style={{ marginTop: 15 }} name='eventName' placeholder='Event name' type='text' value={eventName} onChange={(e) => onChange(e.target.value, setEventName)} />
            <button className={sty.menuBtn} onClick={() => create()}>Create</button>

            {SSUser.events.map((event) => {
                return (
                    <div key={event.eventID}>
                        <h1>Event name: {event.name}</h1>
                        <h3>Code: {event.eventID}</h3>
                        <button className={sty.menuBtn} onClick={() => joinEvent(event.eventID)}>Join</button>
                        <button className={sty.menuBtn} onClick={() => deleteBy(event.eventID)} style={{ backgroundColor: 'var(--system-red)' }}>Delete</button>
                        <br />
                    </div>
                )
            })}
        </div>
    )
}