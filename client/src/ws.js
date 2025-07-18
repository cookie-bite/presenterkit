import { STUI, STUsers, STUser, STUserPanel, STShare, STShares, STSlide, STSlides, STEntry, STTheatre, STCooldown, STQuests, STEvent, STDisplays, STDisplay as STSlideDisplay, STActiveDisplay } from './stores/app.store'
import { STAdmin, STConfig, STMessages, STQueue } from './stores/admin.store'
import { STChat, STDisplay, STTyping } from './stores/scene.store'

import { RTAuth } from './routes/routes'
import { Alert } from './components/core.cmp'


export const initWS = () => {
  var pingTimeout = null
  var reconnectTimeout = null


  const heartbeat = () => {
    clearTimeout(pingTimeout)
    pingTimeout = setTimeout(() => window.ws.close(), 12000) // if ([0, 1].includes(window.ws.readyState)) {window.ws.close() }
  }


  const connect = () => {
    window.ws = new WebSocket(process.env.REACT_APP_WS_URL)

    window.ws.onopen = () => heartbeat()
    window.ws.onclose = () => {
      clearTimeout(pingTimeout)
      clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(reconnect, 1000)
    }

    window.ws.onmessage = (msg) => {
      const res = JSON.parse(msg.data)

      if (res.command === 'PING') res.time = (new Date(Date.now())).toLocaleString('en-GB').split(' ')[1]
      console.log(res)

      if (res.command === 'INIT_USER') {
        STUser.id = res.user.id
        STUser.name = res.user.name
        STUser.color = res.user.color
        STUser.isPresenter = res.user.isPresenter
        STDisplays.list = res.displays
        STSlides.list = res.slides
        STShares.list = res.shares
        Object.assign(STDisplay, res.display)
        Object.assign(STUserPanel, res.roomActivity)

        localStorage.setItem('eventID', res.eventID)
        localStorage.setItem('userID', res.user.id)

        if (res.user.isPresenter) {
          STEntry.show = false
          STQueue.list = res.queue
          STConfig.forwarding = res.config.forwarding
        } else {
          if (!res.user.isInLobby) STEntry.show = false
          else STEntry.showUI = true
          Object.assign(STActiveDisplay, res.activeDisplay)
        }

        if (res.quests.length) {
          let demo = []

          res.quests.map((q) => {
            demo.push({
              id: q.id,
              userID: q.userID,
              username: q.username,
              color: q.color,
              label: q.label,
              effect: q.effect
            })
          })

          STQuests.list = demo
          Object.assign(STDisplay, { quest: res.display.quest, author: res.display.author })
        }
      } else if (res.command === 'SET_STTS') {
        STShares.list = res.shares
        STAdmin.privileged = res.isAdmin
        STAdmin.key = res.adminKey
        if (res.isAdmin) {
          STQueue.list = res.queue
          STConfig.forwarding = res.config.forwarding
          if (res.config.hasOwnProperty('forwarding')) STMessages.tab = res.config.forwarding ? 'Stop' : 'Pass'
          Alert.show({
            icon: { name: 'person-circle-o', color: '--blue' },
            title: 'You are a moderator now',
            buttons: [{ label: 'Open', onClick: () => STUI.name = 'Admin' }]
          })
        } else {
          Alert.show({
            icon: { name: 'person-circle-o', color: '--red' },
            title: 'You are no longer a moderator'
          })
        }
      } else if (res.command === 'SEND_USERS') {
        const quest = {
          id: res.quest.id,
          userID: res.quest.userID,
          username: res.quest.username,
          color: res.quest.color,
          label: res.quest.label,
          effect: res.quest.effect
        }

        STQuests.list.push(quest)

        if (STChat.queue.hasOwnProperty(res.user.id)) STChat.queue[res.user.id].push(quest)
        else STChat.queue[res.user.id] = [quest]
      } else if (res.command === 'DISP_LBL') {
        Object.assign(STDisplay, res.display)
        if (res.display.author) STQuests.list[res.index].effect = false
      } else if (res.command === 'SHR_ACT') {
        if (STUser.id !== res.userID) STShares.list = res.shares
        if (!STUser.isPresenter && !STAdmin.privileged && res.action === 'send') {
          STShare.active = res.activeShare
          STShare.show = true
          STUI.name = 'Shares'
        }
      } else if (res.command === 'SEND_TYP') {
        if (res.isTyping) { STTyping.indicators[res.userID] = { username: res.username, color: res.color } }
        else delete STTyping.indicators[res.userID]
      } else if (res.command === 'ROOM_ACTY') {
        if (res.roomActivity.activity !== 'in lobby' && res.roomActivity.activity !== 'updated') Object.assign(STUserPanel, res.roomActivity)
        if ((res.roomActivity.activity === 'updated' && res.roomActivity.user.id !== STUser.id) || res.roomActivity.activity !== 'updated') STUsers.list = res.userList
      } else if (res.command === 'UPDT_SLDS') {
        STSlides.list = res.slides
      }

      if (res.command === 'SEND_MSG') {
        STQueue.list.push({
          id: res.quest.id,
          userID: res.quest.userID,
          author: res.quest.author,
          label: res.quest.label,
          color: res.quest.color
        })
      } else if (res.command === 'UPDT_QUE') {
        STQueue.list = res.queue
      } else if (res.command === 'UPDT_CNFG') {
        STConfig[res.name] = res.updateTo
        if (res.name === 'forwarding') STMessages.tab = res.updateTo.is ? 'Stop' : 'Pass'
      } else if (res.command === 'UPDT_STTS') {
        STUsers.list = res.userList
      } else if (res.command === 'CLDW_USER') {
        localStorage.setItem('CLDW', res.cooldown)
        STCooldown.active = true
        STUI.name = ''
        STEntry.show = true
        STUI.name = ''
        STEntry.show = true
      }

      if (res.command === 'UPDT_DISP') { // When presenter changes slide
        STDisplays.list.filter((display) => { if (display.id === res.displayID) display.slide = res.slide })
        if (STSlideDisplay.id === res.displayID) STSlideDisplay.slide = res.slide
        if (STActiveDisplay.id === res.displayID) STActiveDisplay.slide = res.slide
      } else if (res.command === 'UPDT_DISPS') { // When presenter starts sharing on a new display
        STDisplays.list = res.displays
      } else if (res.command === 'SHARE_DISP') { // When presenter starts/stops live sharing
        STActiveDisplay.id = res.state ? res.displayID : ''
        STActiveDisplay.slide = res.state ? res.slide : {}

        if (!STUser.isPresenter || STSlideDisplay.id) {
          if (res.state) {
            Alert.show({
              icon: { name: 'tv-o', color: '--green' },
              title: 'Presenter shares slide now',
              buttons: [{ label: 'Open', onClick: () => { STTheatre.show = true, STUI.name = 'Slides' } }]
            })
          } else {
            STTheatre.show = false
            Alert.show({
              icon: { name: 'tv-o', color: '--red' },
              title: 'Presenter finished slide sharing'
            })
          }
        }
      } else if (res.command === 'CLOS_DISP') {
        if (STSlideDisplay.id === res.displayID) {
          const newWindow = window.open('', '_self')
          newWindow.close()
        }
      }

      if (res.command === 'PING') {
        heartbeat()
        window.ws.send(JSON.stringify({ command: 'PONG' }))
      }
    }
  }


  const reconnect = () => {
    connect()

    const interval = setInterval(async () => {
      if (window.ws.readyState === 1) {
        clearInterval(interval)

        if (localStorage.getItem('ACS_TKN')) await RTAuth.refreshToken()

        window.ws.send(JSON.stringify({
          command: 'JOIN_ROOM',
          eventID: STEvent.id ? STEvent.id : localStorage.getItem('eventID'),
          userID: localStorage.getItem('userID'),
          displayID: STSlideDisplay.id,
          token: localStorage.getItem('ACS_TKN')
        }))
      }
    }, 10)
  }


  connect()
}