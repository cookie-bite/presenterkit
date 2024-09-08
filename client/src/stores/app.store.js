import { proxy } from 'valtio'


export const STAppUI = proxy({ name: 'Account' })

export const STAccountUI = proxy({ name: localStorage.getItem('SIGNED_IN') ? 'Board' : 'Auth' })

export const STAuthUI = proxy({ name: 'SignIn' })

export const STRoute = proxy({ path: window.location.pathname, params: {} })

export const STEvent = proxy({ id: '', name: '' })

export const STApp = proxy({ isFullscreen: false })

export const STHost = proxy({ ip: '', all: [], port1: '3000', port2: process.env.NODE_ENV === 'development' ? '50000' : '3000' })

export const STUI = proxy({ name: '' })

export const STUser = proxy({ id: '', name: '', color: '#ffffff', isPresenter: false })

export const STUsers = proxy({ list: Array(1).fill() })

export const STUserPanel = proxy({ user: { id: '', name: '' }, activity: '' })

export const STShare = proxy({ active: 0, show: false })

export const STShares = proxy({ list: [{ body: '', isShared: false, urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }] }] })

export const STSlide = proxy({ active: { index: 0, page: 1 }, play: { index: 0, page: 1 } })

export const STSlides = proxy({ list: [] })

export const STSpinner = proxy({ isActive: false })

export const STEntry = proxy({ show: true })

export const STPages = proxy({ show: false })

export const STTheatre = proxy({ show: false, showClose: true })

export const STCooldown = proxy({ active: false, count: 0 })

export const STPanel = proxy({ position: localStorage.getItem('PANEL_POS') ? localStorage.getItem('PANEL_POS') : `${localStorage.setItem('PANEL_POS', 'right') === undefined && 'right'}` })

export const STQuests = proxy({ list: [] })