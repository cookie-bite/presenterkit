import { send } from './routes'


export const create = (name) => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ name })

    send('/event/create', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})