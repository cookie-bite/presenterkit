import { useEffect } from 'react'
import { STApp, STScene, STAdmin } from './stores/app.store'

import { Scene } from './scene/core.sc'
import { Desktop } from './interface/desktop/core.dui'
import { Mobile } from './interface/mobile/core.mui'
import { Alert } from './components/core.cmp'


const core = { openingText: 'Welcome to WWDC23', isPresenter: window.location.hostname === 'localhost' }
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const ws = new WebSocket(`ws://${window.location.hostname}:50001`)  // on production: 3001

window.addEventListener('resize', (event) => {
    if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) STApp.isFullscreen = true
    else STApp.isFullscreen = false
})

export const App = () => {


    ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data)
        console.log(res)

        if (res.command === 'INIT_USER') {
            STApp.host.ip = res.ip.address
            STApp.userID = res.user.id
            STApp.roomActivity = res.roomActivity
            STApp.slides = res.slides
            STApp.shares = res.shares
            STScene.display = res.display

            if (core.isPresenter) {
                STAdmin.queue = res.queue
                STAdmin.config.forwarding = res.config.forwarding
            } else {
                STApp.username = res.user.name
                STApp.userColor = res.user.color
                STApp.activeSlide = res.activeSlide
            }

            if (res.quests.length) {
                let demo = []

                res.quests.map((q) => {
                    demo.push({
                        effect: q.effect,
                        color: q.color,
                        label: q.label,
                        username: q.username,
                        pos: core.isMobile ? q.pos.mob : q.pos.web
                    })
                })

                STScene.quests = demo
                STScene.display = { quest: res.display.quest, author: res.display.author }
            }
        } else if (res.command === 'SET_STTS') {
            STApp.shares = res.shares
            STAdmin.isAdmin = res.isAdmin
            STAdmin.adminKey = res.adminKey
            if (res.isAdmin) {
                STAdmin.queue = res.queue
                STAdmin.config.forwarding = res.config.forwarding
                if (res.config.hasOwnProperty('forwarding')) STAdmin.activeCheckTab = res.config.forwarding ? 'Stop' : 'Pass'
                Alert.show({
                    icon: { name: 'person-circle-o', color: '--system-blue' },
                    title: 'You are a moderator now',
                    buttons: [{ label: 'Open', onClick: () => STApp.uiName = 'Admin' }]
                })
            } else {
                Alert.show({
                    icon: { name: 'person-circle-o', color: '--system-red' },
                    title: 'You are no longer a moderator'
                })
            }
        } else if (res.command === 'SEND_USER') {
            STScene.quests.push({
                effect: res.quest.effect,
                color: res.quest.color,
                label: res.quest.label,
                username: res.quest.username,
                pos: core.isMobile ? res.quest.pos.mob : res.quest.pos.web
            })
        } else if (res.command === 'DISP_LBL') {
            STAdmin.display = res.display
            STScene.display = res.display
            if (res.display.author) STScene.quests[res.index].effect = false
        } else if (res.command === 'SHR_ACT') {
            if (STApp.userID !== res.userID) STApp.shares = res.shares
            if (!core.isPresenter && !STAdmin.isAdmin && res.action === 'send') {
                STApp.activeShare = res.activeShare
                STApp.showShare = true
                STApp.uiName = 'Shares'
            }
        } else if (res.command === 'SEND_TYP') {
            if (res.isTyping) { STScene.indicators[res.userID] = { username: res.username, pos: core.isMobile ? res.pos.mob : res.pos.web, color: res.color } }
            else delete STScene.indicators[res.userID]
        } else if (res.command === 'ROOM_ACTY') {
            if (res.roomActivity.activity !== 'in lobby' && res.roomActivity.activity !== 'updated') STApp.roomActivity = res.roomActivity
            if ((res.roomActivity.activity === 'updated' && res.roomActivity.user.id !== STApp.userID) || res.roomActivity.activity !== 'updated') STApp.userList = res.userList
        } else if (res.command === 'UPDT_SLDS') {
            if (!core.isPresenter) {
                if (res.slidesUpdate) STApp.slides = res.slides
                else {
                    STApp.activeSlide = res.activeSlide
                    if (res.isStarted && !res.pageUpdate) {
                        Alert.show({
                            icon: { name: 'tv-o', color: '--system-green' },
                            title: 'Presenter shares slide now',
                            buttons: [{ label: 'Open', onClick: () => { STApp.showTheatre = true, STApp.uiName = 'Slides' } }]
                        })
                    } else if (!res.isStarted) {
                        STApp.showTheatre = false
                        Alert.show({
                            icon: { name: 'tv-o', color: '--system-red' },
                            title: 'Presenter finished slide sharing'
                        })
                    }
                }
            }
        }

        if (res.command === 'APR_REQ') {
            STAdmin.queue.push({
                id: res.quest.id,
                userID: res.quest.userID,
                author: res.quest.author,
                label: res.quest.label,
                color: res.quest.color
            })
        } else if (res.command === 'UPDT_QUE') {
            if (res.isFullUpdate) STAdmin.queue = res.queue
            else STAdmin.queue.splice(res.index, 1)
        } else if (res.command === 'UPDT_CNFG') {
            STAdmin.config[res.name] = res.updateTo
            if (res.name === 'forwarding') STAdmin.activeCheckTab = res.updateTo.is ? 'Stop' : 'Pass'
        } else if (res.command === 'UPDT_STTS') {
            STAdmin.userList = res.userList
        } else if (res.command === 'CLDW_USER') {
            localStorage.setItem('CLDW', res.cooldown)
            STApp.hasCooldown = true
            STApp.uiName = ''
            STApp.showEntry = true
            STApp.uiName = ''
            STApp.showEntry = true
        }
    }


    useEffect(() => {
        // const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
        // let s = 0
        // setInterval(() => {
        //     console.clear()
        //     console.log(s, 'ws state:', states[ws.readyState])
        //     s++
        // }, 1000)
    }, [])


    return (
        <>
            <Scene ws={ws} core={core} />
            {!core.isMobile && <Desktop ws={ws} core={core} />}
            {core.isMobile && <Mobile ws={ws} core={core} />}
        </>
    )
}