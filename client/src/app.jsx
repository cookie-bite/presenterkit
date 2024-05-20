import { STApp, STHost, STUI, STUsers, STUser, STUserPanel, STShare, STShares, STSlide, STSlides, STEntry, STTheatre, STCooldown, STQuests } from './stores/app.store'
import { STAdmin, STConfig, STMessages, STQueue } from './stores/admin.store'
import { STChat, STDisplay, STTyping } from './stores/scene.store'

import { Scene } from './scene/core.scn'
import { Desktop } from './interface/desktop/core.dui'
import { Mobile } from './interface/mobile/core.mui'
import { Alert } from './components/core.cmp'


const core = {
    userRoom: 1,
    adminRoom: 0,
    openingText: 'Welcome to Event',
    isMobile: 'ontouchend' in document,
    isPresenter: window.location.hostname === 'localhost',
    isDev: process.env.NODE_ENV === 'development'
}


window.addEventListener('resize', () => {
    if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) STApp.isFullscreen = true
    else STApp.isFullscreen = false
})



// Websocket

var ws = null
var pingTimeout = null

const connect = () => ws = new WebSocket(`ws://${window.location.hostname}:${core.isDev ? 50000 : 3000}`)

const reconnect = () => location.reload()

const heartbeat = () => {
    clearTimeout(pingTimeout)
    pingTimeout = setTimeout(() => ws.close(), 31000)
}


connect()

ws.onopen = () => heartbeat()
ws.onclose = () => { clearTimeout(pingTimeout); alert('ws closed'); reconnect() }



// Component

export const App = () => {

    ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data)
        console.log(res)

        if (res.command === 'INIT_USER') {
            STHost.ip = res.ip.address
            STHost.all = res.ip.all
            STUser.id = res.user.id
            Object.assign(STUserPanel, res.roomActivity)
            STSlides.list = res.slides
            STShares.list = res.shares
            Object.assign(STDisplay, res.display)

            if (core.isPresenter) {
                STQueue.list = res.queue
                STConfig.forwarding = res.config.forwarding
            } else {
                STUser.name = res.user.name
                STUser.color = res.user.color
                STSlide.active = res.activeSlide
            }

            if (res.quests.length) {
                let demo = []

                res.quests.map((q) => {
                    demo.push({
                        effect: q.effect,
                        color: q.color,
                        label: q.label,
                        username: q.username
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
                    icon: { name: 'person-circle-o', color: '--system-blue' },
                    title: 'You are a moderator now',
                    buttons: [{ label: 'Open', onClick: () => STUI.name = 'Admin' }]
                })
            } else {
                Alert.show({
                    icon: { name: 'person-circle-o', color: '--system-red' },
                    title: 'You are no longer a moderator'
                })
            }
        } else if (res.command === 'SEND_USER') {

            const quest = {
                effect: res.quest.effect,
                color: res.quest.color,
                label: res.quest.label,
                userID: res.quest.userID,
                username: res.quest.username
            }

            STQuests.list.push(quest)

            if (STChat.queue.hasOwnProperty(res.user.id)) STChat.queue[res.user.id].push(quest)
            else STChat.queue[res.user.id] = [quest]

        } else if (res.command === 'DISP_LBL') {
            Object.assign(STDisplay, res.display)
            if (res.display.author) STQuests.list[res.index].effect = false
        } else if (res.command === 'SHR_ACT') {
            if (STUser.id !== res.userID) STShares.list = res.shares
            if (!core.isPresenter && !STAdmin.privileged && res.action === 'send') {
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
            if (!core.isPresenter) {
                if (res.slidesUpdate) STSlides.list = res.slides
                else {
                    STSlide.active = res.activeSlide
                    if (res.isStarted && !res.pageUpdate) {
                        Alert.show({
                            icon: { name: 'tv-o', color: '--system-green' },
                            title: 'Presenter shares slide now',
                            buttons: [{ label: 'Open', onClick: () => { STTheatre.show = true, STUI.name = 'Slides' } }]
                        })
                    } else if (!res.isStarted) {
                        STTheatre.show = false
                        Alert.show({
                            icon: { name: 'tv-o', color: '--system-red' },
                            title: 'Presenter finished slide sharing'
                        })
                    }
                }
            }
        }

        if (res.command === 'APR_REQ') {
            STQueue.list.push({
                id: res.quest.id,
                userID: res.quest.userID,
                author: res.quest.author,
                label: res.quest.label,
                color: res.quest.color
            })
        } else if (res.command === 'UPDT_QUE') {
            if (res.isFullUpdate) STQueue.list = res.queue
            else STQueue.list.splice(res.index, 1)
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

        if (res.command === 'PING') {
            heartbeat()
            ws.send(JSON.stringify({ command: 'PONG' }))
        }
    }


    return (
        <>
            <Scene ws={ws} core={core} />
            {!core.isMobile && <Desktop ws={ws} core={core} />}
            {core.isMobile && <Mobile ws={ws} core={core} />}
        </>
    )
}