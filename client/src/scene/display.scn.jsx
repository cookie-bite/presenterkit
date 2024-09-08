import { Center, Text3D } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { STDisplay } from '../stores/scene.store'
import { STUsers } from '../stores/app.store'
import { Effects } from './effects.scn'

import { wrap, calcRows } from '../utilities/core.utils'


export const Display = ({ core }) => {
    const SSDisplay = useSnapshot(STDisplay)
    const SSUsers = useSnapshot(STUsers)


    return (
        <Effects core={core}>
            <group position={[0, 2.7 + 0.65 * calcRows(SSUsers.list.length), 0]}>
                <Center>
                    <Text3D font={'/fonts/json/inter_regular.json'} bevelEnabled bevelSize={0.05} height={0.05}>
                        {wrap(SSDisplay.quest, 4)}
                        <meshStandardMaterial attach='material' color={'#fff'} emissive={'#fff'} emissiveIntensity={0.4} toneMapped={false} />
                    </Text3D>
                </Center>
            </group>
        </Effects>
    )
}