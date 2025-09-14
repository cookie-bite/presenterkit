import { send, sendAuth } from './routes'


export const verify = (eventID) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('ACS_TKN') }
  const body = JSON.stringify({ eventID })

  sendAuth('/event/verify', { method: 'POST', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})


export const create = (name) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ name })

  send('/event/create', { method: 'POST', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})


export const deleteBy = (eventID) => new Promise(async (resolve, reject) => {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ eventID })

  send('/event/delete', { method: 'DELETE', headers, body })
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})