import { send } from './routes'


export const create = (eventID, label, slide) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ eventID, label, slide })

  send('/display/create', { method: 'POST', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})


export const init = (eventID, displayID) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ eventID, displayID })

  send('/display/init', { method: 'POST', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})


export const close = (eventID, displayID) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ eventID, displayID })

  send('/display/close', { method: 'DELETE', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})