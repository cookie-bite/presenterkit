import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { STApp, STDisplay, STEvent, STRoute } from './stores/app.store'
import { RTAuth, RTEvent } from './routes/routes'

import { Scene } from './scene/core.scn'
import { Desktop } from './interface/desktop/core.dui'
import { Mobile } from './interface/mobile/core.mui'
import { initWS } from './ws'

import { Display } from './interface/desktop/display.dui'

import { Icon } from './components/core.cmp'
import sty from './styles/modules/desktop.module.css'


const core = {
  openingText: 'Welcome to Event',
  isMobile: 'ontouchend' in document,
  isDev: process.env.NODE_ENV === 'development'
}


window.addEventListener('resize', () => {
  if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) STApp.isFullscreen = true
  else STApp.isFullscreen = false
})



export const Event = () => {
  const SSEvent = useSnapshot(STEvent)
  const SSDisplay = useSnapshot(STDisplay)


  const init = async () => {
    const params = new URL(window.location.toString()).searchParams

    if (!STEvent.id && params.get('id')) {
      STEvent.id = params.get('id')

      if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

      RTEvent.verify(STEvent.id).then((data) => {
        STEvent.status = data.status
        STEvent.showUI = true

        if (data.success) {
          initWS()

          if (params.get('d')) STDisplay.id = params.get('d')
        }
      })
    }
  }

  useEffect(() => {
    init()

    return () => window.ws.close()
  }, [])


  return (
    SSEvent.showUI && <>
      {SSEvent.status.code === 'OPEN' && <>
        {SSDisplay.id
          ? <Display />
          : <>
            <Scene core={core} />
            {!core.isMobile && <Desktop core={core} />}
            {core.isMobile && <Mobile core={core} />}
          </>
        }
      </>}
      {SSEvent.status.code !== 'OPEN' && <div className={sty.cooldown}>
        <div className={sty.cooldownIc}>
          {SSEvent.status.code === 'NONEXIST' && <Icon name='timer-o' size={30} color='--red' />}
          {SSEvent.status.code === 'UNOPENED' && <Icon name='timer-o' size={30} color='--red' />}
        </div>
        <div className={sty.cooldownLbl}>
          <h1 className={sty.cooldownTtl}>{SSEvent.status.title}</h1>
          <h3 className={sty.cooldownSbtl}>{SSEvent.status.subtitle}</h3>
        </div>
        <h2 className={sty.cooldownTimer}></h2>
      </div>}
    </>
  )
}