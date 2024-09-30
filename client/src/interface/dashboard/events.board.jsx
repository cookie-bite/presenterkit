import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTAuth, RTEvent, RTUser } from '../../routes/routes'
import { STEvent, STUser } from '../../stores/app.store'
import { goTo, Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/dashboard.module.css'


export const Events = () => {
    const [eventName, setEventName] = useState('')

    const SSUser = useSnapshot(STUser)


    const onChange = (value, set) => {
        set(value)
    }

    const create = () => {
        setEventName('')
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
        <div className={sty.eventsPage}>
            <div className={sty.profile}>
                <Icon name='person-circle-o' size={60} color='--gray-1' />
                <div className={sty.info}>
                    <h2 className={sty.username}>{SSUser.name}</h2>
                    <h4 className={sty.email}>{localStorage.getItem('EMAIL')}</h4>
                </div>
                <button className={sty.exitBtn} onClick={() => signOut()} style={{ backgroundColor: 'var(--red)' }}>
                    <Icon name='exit-o' size={24} color='--white' style={{ marginRight: 5 }} />Sign out
                </button>
            </div>

            <div className={sty.eventForm}>
                <input className={sty.eventInput} name='eventName' placeholder='Event name' type='text' value={eventName} onChange={(e) => onChange(e.target.value, setEventName)} />
                <button className={sty.eventBtn} onClick={() => create()}>Create</button>
            </div>

            <div className={sty.events}>
                {SSUser.events.map((event) => {
                    return (
                        <div className={sty.event} key={event.eventID}>
                            <div className={sty.eventDetails}>
                                <h1 className={sty.eventName}>{event.name}</h1>
                                <h3 className={sty.eventCodeLbl}>Code: <strong className={sty.eventCode}>{event.eventID}</strong></h3>
                            </div>
                            <div className={sty.eventBtns}>
                                <button className={sty.deleteBtn} onClick={() => deleteBy(event.eventID)}>
                                    <Icon name='trash-o' size={24} color='--red' />
                                </button>
                                <button className={sty.joinBtn} onClick={() => joinEvent(event.eventID)}>
                                    <Icon name='open-o' size={24} color='--white' style={{ marginRight: 5 }} />Start
                                </button>
                            </div>
                            <br />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}