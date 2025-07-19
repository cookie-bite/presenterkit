import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { RTEvent, RTUser } from '../../routes/routes'
import { STEvent, STSpinner, STUser } from '../../stores/app.store'
import { Icon, Spinner } from '../../components/core.cmp'

import sty from '../../styles/modules/dashboard.module.css'


export const Events = () => {
  const [eventName, setEventName] = useState('')
  const [copyLbl, setCopyLbl] = useState('Copy')

  const SSUser = useSnapshot(STUser)
  const SSSpinner = useSnapshot(STSpinner)


  const onChange = (value, set) => {
    set(value)
  }

  const create = () => {
    STSpinner.isActive = true
    setEventName('')

    RTEvent.create(eventName).then((data) => {
      STSpinner.isActive = false
      if (data.success) {
        STUser.events.unshift({ eventID: data.event.id, name: data.event.name })
      }
    })
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopyLbl('Copied')
    setTimeout(() => setCopyLbl('Copy'), 750)
  }

  const uploadEvent = (eventID) => {
    window.open(`${process.env.REACT_APP_APP_URL}/upload?id=${eventID}`, '_blank')
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
        STUser.events = data.user.events.reverse()
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
          <div className={sty.eventCreation}>
            <h1>Create Event</h1>
            <div className={sty.eventForm}>
              <input className={sty.eventInput} name='eventName' placeholder='Event name' type='text' value={eventName}
                onChange={(e) => onChange(e.target.value, setEventName)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') create() }}
              />
              {SSSpinner.isActive
                ? <Spinner style={{ marginTop: -40, transform: 'scale(.5) translateY(50%)' }} />
                : <button className={sty.eventBtn} onClick={() => create()}>Create</button>
              }
            </div>
          </div>
          <div className={sty.events}>
            {SSUser.events.map((event) => {
              return (
                <div className={sty.event} key={event.eventID}>
                  <div className={sty.eventDetails}>
                    <h1 className={sty.eventName}>{event.name}</h1>
                    <div className={sty.eventUrl}>
                      <h4 onClick={() => joinEvent(event.eventID)}>{process.env.REACT_APP_HOST_URL.split('//')[1]}/event?id={event.eventID}</h4>
                      <button className={sty.copyBtn} onClick={() => copyUrl(`${process.env.REACT_APP_HOST_URL}/event?id=${event.eventID}`)}>
                        <Icon name='copy-o' size={16} color='--blue' />
                        <div className='tooltip tooltipTop'>{copyLbl}</div>
                      </button>
                    </div>
                    <button className={sty.uploadBtn} onClick={() => uploadEvent(event.eventID)}>Public Upload URL</button>
                  </div>
                  <div className={sty.eventBtns}>
                    <div className={sty.presenterInfo}>
                      <div className={sty.avatarView} style={{ background: `linear-gradient(45deg, ${STUser.color}24, ${STUser.color}2B)` }}>
                        <h1 className={sty.avatarLbl} style={{ color: STUser.color }}>{STUser.name.charAt()}</h1>
                      </div>
                      <h2 className={sty.presenterLbl}>{STUser.name}</h2>
                    </div>
                    <button className={sty.joinBtn} onClick={() => joinEvent(event.eventID)}>Join</button>
                  </div>
                  <button className={sty.deleteBtn} onClick={() => deleteBy(event.eventID)}>
                    <Icon name='trash-o' size={24} color='--red' />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}