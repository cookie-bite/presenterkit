import { proxy } from "valtio"


export const STApp = proxy({
    userId: 0,
    userName: '',
    isMobile: false
})