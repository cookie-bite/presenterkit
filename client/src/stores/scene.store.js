import { proxy } from 'valtio'


export const STDisplay = proxy({ quest: 'Welcome to Event', author: '' })

export const STTyping = proxy({ indicators: {} })

export const STChat = proxy({ queue: {} })