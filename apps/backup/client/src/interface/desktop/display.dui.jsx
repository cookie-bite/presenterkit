import { useEffect, useRef, memo, useMemo } from 'react'
import { useSnapshot } from 'valtio'
import Countdown from 'react-countdown'

import { STDisplay, STEvent } from '../../stores/app.store'
import { RTAuth, RTDisplay } from '../../routes/routes'

import sty from '../../styles/modules/desktop.module.css'


const CountdownRenderer = ({ minutes, seconds, completed }) => {
  return (
    <div className={sty.displayMainTimerCounter}>
      <h3 style={{ color: completed ? 'var(--red)' : 'var(--orange)' }}>{`${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`}</h3>
    </div>
  )
}


const Counter = memo(() => {
  const SSDisplay = useSnapshot(STDisplay)
  const countdownRef = useRef(null)

  const date = useMemo(() => {
    return Date.now() + SSDisplay.timer.duration * 60 * 1000
  }, [SSDisplay.timer.duration])

  useEffect(() => {
    console.log('Display useEffect()', SSDisplay.timer)
    if (!SSDisplay.timer || !countdownRef.current) return

    const api = countdownRef.current.getApi()

    if (SSDisplay.timer.action === 'ADD') {

    } else if (SSDisplay.timer.action === 'START') {
      api.start()
    } else if (SSDisplay.timer.action === 'PAUSE') {
      api.pause()
    } else if (SSDisplay.timer.action === 'STOP') {
      api.stop()
    } else if (SSDisplay.timer.action === 'REMOVE') {
      STDisplay.timer = null
    }
  }, [SSDisplay.timer])

  return (
    <Countdown
      ref={countdownRef}
      date={date}
      renderer={CountdownRenderer}
      autoStart={false}
    />
  )
}, () => { return false })


export const Display = () => {
  const SSDisplay = useSnapshot(STDisplay)
  const SSEvent = useSnapshot(STEvent)

  const init = () => {
    RTDisplay.init(STEvent.id, STDisplay.id).then((data) => {
      console.log('Display UI', data)

      if (data.success) {
        STDisplay.label = data.display.label
        if (data.display.slide) STDisplay.slide = data.display.slide


        const interval = setInterval(async () => {
          if (window.ws.readyState === 1) {
            clearInterval(interval)

            if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

            window.ws.send(JSON.stringify({
              command: 'JOIN_ROOM',
              eventID: STEvent.id ? STEvent.id : localStorage.getItem('eventID'),
              userID: localStorage.getItem('userID'),
              displayID: STDisplay.id,
              token: localStorage.getItem('ACS_TKN')
            }))
          }
        }, 10)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])


  return (
    <div className={sty.display}>
      {SSDisplay.slide && SSDisplay.slide.name && <>
        <img className={sty.displayBgImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSDisplay.slide.name}/${SSDisplay.slide.page}.webp`} alt={`Page ${SSDisplay.slide.page}`} />
        <img className={sty.displayImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSDisplay.slide.name}/${SSDisplay.slide.page}.webp`} alt={`Page ${SSDisplay.slide.page}`} />
      </>}
      {!SSDisplay.slide && SSDisplay.timer?.hasOwnProperty('duration') && (
        <Counter />
      )}
    </div>
  )
}