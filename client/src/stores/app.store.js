import { proxy } from 'valtio'


export const STApp = proxy({ isFullscreen: false })

export const STHost = proxy({ ip: '', port1: '3000', port2: '3000' }) // on production: 3000, 3000

export const STUI = proxy({ name: '' })

export const STUser = proxy({ id: '', name: '', color: '#ffffff' })

export const STUsers = proxy({ list: Array(1).fill() })

export const STUserPanel = proxy({ user: { id: '', name: '' }, activity: '' })

export const STShare = proxy({ active: 0, show: false })

export const STShares = proxy({ list: [{ body: '', isShared: false, urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }] }] })

export const STSlide = proxy({ active: { index: 0, page: 1 }, play: { index: 0, page: 1 } })

export const STSlides = proxy({ list: [] })

export const STEntry = proxy({ show: true })

export const STPages = proxy({ show: false })

export const STTheatre = proxy({ show: false, showClose: true })

export const STCooldown = proxy({ active: false, count: 0 })

export const STPanel = proxy({ position: localStorage.getItem('PANEL_POS') ? localStorage.getItem('PANEL_POS') : `${localStorage.setItem('PANEL_POS', 'right') === undefined && 'right'}` })

export const STQR = proxy({ expand: false })

export const STQuests = proxy({ list: [] })