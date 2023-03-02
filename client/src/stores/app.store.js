import { proxy } from 'valtio'


export const STApp = proxy({
    uiName: 'Board',
    userID: 0,
    username: '',
    adminRoom: 0,
    userRoom: 1
})