import { Input } from './input.ui'
import { Share } from './modal.ui'
import { Menu } from './menu.ui'


export const Interface = ({ ws, core }) => {
    return (
        <div>
            <Input ws={ws} core={core} />
            <Menu ws={ws} />
            <Share />
        </div>
    )
}