import { send } from './routes'


export const create = (eventID, label, slide) => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ eventID, label, slide })

    send('/display/create', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})