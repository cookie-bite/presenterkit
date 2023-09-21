import { proxy } from 'valtio'


export const STApp = proxy({
    host: { ip: '', port1: '3000', port2: '50000' },  // on production: 3000, 3000
    uiName: '',
    userID: '',
    username: '',
    userColor: '#ffffff',
    roomActivity: { user: { id: '', name: '' }, activity: '' },
    adminRoom: 0,
    userRoom: 1,
    userList: [],
    shares: [{ body: '', urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }], isShared: false }],
    activeShare: 0,
    showShare: false,
    slides: [],
    activeSlide: { index: 0, page: 1 },
    playSlide: { index: 0, page: 1 },
    showEntry: true,
    showPages: false,
    showTheatre: false,
    hasCooldown: false,
    cooldown: 0,
    showEdit: false,
    isFullscreen: false
})

export const STScene = proxy({
    quests: [],
    display: { quest: '', author: '' },
    indicators: {}
})

export const STDesktop = proxy({
    panel: { position: localStorage.getItem('PANEL_POS') ? localStorage.getItem('PANEL_POS') : `${localStorage.setItem('PANEL_POS', 'right') === undefined && 'right'}` },
    qr: { expand: false },
    showSlides: false
})

export const STMobile = proxy({
    menu: { isActive: false },
    showCloseBtn: true
})

export const STAdmin = proxy({
    isAdmin: false,
    adminKey: '',
    uiName: 'Messages',
    userList: [],
    display: { quest: 'Welcome to WWDC23', author: '' },
    queue: [],
    share: { link: '', icon: '', label: '', text: '' },
    config: { forwarding: { is: false } },
    showSearch: false,
    showSearchList: false,
    activeAdmin: '',
    activeCheckTab: 'Pass'
})