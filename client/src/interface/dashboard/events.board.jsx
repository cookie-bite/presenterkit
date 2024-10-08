import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTEvent, RTUser } from '../../routes/routes'
import { STEvent, STUser } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

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


    useEffect(() => getData(), [STEvent])


    return (
        <div className={sty.page}>
            <div className={sty.header}>
                <h1>Events</h1>
            </div>

            <div className={sty.pageInner}>
                <div className={sty.eventsPage}>
                    <div className={sty.eventForm}>
                        <input className={sty.eventInput} name='eventName' placeholder='Event name' type='text' value={eventName}
                            onChange={(e) => onChange(e.target.value, setEventName)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') create() }}
                        />
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
            </div>
        </div>
    )
}