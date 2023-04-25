import { proxy } from 'valtio'
import { genColor } from '../utilities/core.utils'


export const STApp = proxy({
    uiName: 'Board',
    userID: 0,
    username: '',
    roomActivity: { userList: [], username: '', activity: '' },
    indColor: genColor(),
    adminRoom: 0,
    userRoom: 1,
    share: { isActive: false, data: {} }
})

export const STScene = proxy({
    share: {},
    quests: [],
    display: { quest: 'Welcome to WWDC23', author: '' },
    indicators: {}
})

export const STScreen = proxy({
    host: { ip: '', port: '3000' },
    uiName: '',
    controls: { isActive: false, isFullscreen: false },
    panel: { position: localStorage.getItem('PANEL_POS') ? localStorage.getItem('PANEL_POS') : `${localStorage.setItem('PANEL_POS', 'right') === undefined && 'right'}` },
    qr: { expand: false }
})

export const STUI = proxy({
    menu: { isActive: false, isFullscreen: false }
})

export const STAdmin = proxy({
    uiName: 'Queue',
    display: { quest: 'Welcome to WWDC23', author: '' },
    queue: [],
    share: { link: '', icon: '', label: '', text: '' },
    config: { forwarding: { is: false } }
})