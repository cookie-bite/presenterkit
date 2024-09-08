import { send, sendAuth } from './routes'



export const refreshToken = async () => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ token: localStorage.getItem('RFS_TKN') })

    sendAuth('/auth/refresh', { method: 'POST', headers, body })
        .then(async (data) => {
            if (data.success) localStorage.setItem('ACS_TKN', data.accessToken)
            resolve(data)
        })
        .catch((err) => reject(err))
})



export const signIn = (email, password) => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ email, password })

    sendAuth('/auth/signin', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})



export const signUp = (username, email, password, color) => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ username, email, password, color })

    sendAuth('/auth/signup', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})



export const signOut = () => new Promise(async (resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ token: localStorage.getItem('RFS_TKN') })

    send('/auth/signout', { method: 'DELETE', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})