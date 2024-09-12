import { send } from './routes'


export const getData = () => new Promise(async (resolve, reject) => {
    send('/user/data', { method: 'GET' })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})