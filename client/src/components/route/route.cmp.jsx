import { STRoute } from '../../stores/app.store'


export const Route = ({ path, component }) => {
    return (
        <>
            {STRoute.path === path && component()}
        </>
    )
}


export const goTo = (path = '/') => {
    window.history.pushState({}, '', path)
    STRoute.path = path
}