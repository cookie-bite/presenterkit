import { useSnapshot } from 'valtio'
import { STRoute } from '../../stores/app.store'


export const Router = (props) => {
    const SSRoute = useSnapshot(STRoute)
    return props.children.filter(c => c.props.path === SSRoute.path)
}


export const goTo = (path = '/') => {
    window.history.pushState({}, '', path)
    STRoute.path = path
}