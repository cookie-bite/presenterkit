import { proxy } from 'valtio'


export const STAdmin = proxy({ privileged: false, key: '' })

export const STTab = proxy({ name: 'Messages' })

export const STQueue = proxy({ list: [] })

export const STShare = proxy({ link: '', icon: '', label: '', text: '' })

export const STConfig = proxy({ forwarding: { is: false } })

export const STSearch = proxy({ showBar: false, showList: false })

export const STModerator = proxy({ active: '' })

export const STMessages = proxy({ tab: 'Pass' })