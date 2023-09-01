import { useRef, useEffect } from 'react'
import { OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useControl, Controls } from 'react-three-gui'
import { useSnapshot } from 'valtio'
import { STApp, STScene, STDesktop } from '../stores/app.store'
import { clamp, wrap } from '../utilities/core.utils'


export const Scene = ({ ws, core }) => {
    const dLight = useRef()


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.altKey && e.code.slice(3) === 'N') {
                window.open(`http://${STApp.host.ip}:${STApp.host.port1}`, '_blank')
            }

            if (STApp.showEntry) return

            if (e.key === 'Escape' && STApp.uiName === '') {
                STScene.display = { quest: core.openingText, author: '' }
                ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STScene.display }))
            }

            if (e.altKey && e.code.slice(3) === 'C') {
                STDesktop.controls.isActive = !STDesktop.controls.isActive
            }
        }
        window.addEventListener('keyup', onKeyUp)
        return () => {
            // ws.close()
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [])


    const Canvas = ({ children }) => {
        return (
            <Controls.Provider>
                <Controls.Canvas shadows>{children}</Controls.Canvas>
                {false && <Controls title='Settings' />}
            </Controls.Provider>
        )
    }


    const CamnCon = () => {
        const camera = useRef()
        const controls = useRef()

        const posX = useControl('Pos X', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Pos', value: 26, min: -10, max: 100 })


        // useEffect(() => {
        //     if (!controls.current || !camera.current) return

        //     // camera.current.position.set(0, 3, 4)
        //     controls.current.target.set(0, 1, 0)
        // }, [camera, controls])


        return (
            <>
                <PerspectiveCamera ref={camera} position={[posX, posY, core.isMobile ? 80 : 26]} fov={30} near={0.01} far={1500} makeDefault />
                <OrbitControls ref={controls} />
            </>
        )
    }


    const Light = () => {
        const sceneSnap = useSnapshot(STScene)

        // useHelper(dLight, DirectionalLightHelper, 0.5, 'teal')
        const dLightIntensity = useControl('D Intensity', { type: 'number', group: 'Light', value: 1, min: 0, max: 1 })
        const aLightIntensity = useControl('A Intensity', { type: 'number', group: 'Light', value: 1, min: 0, max: 2 })

        const posX = useControl('Pos X', { type: 'number', group: 'Light', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Light', value: 5, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Light', value: 4, min: -10, max: 10 })

        return (
            <>
                <ambientLight intensity={sceneSnap.display.quest === core.openingText ? aLightIntensity : 0.04} />
                <directionalLight ref={dLight} castShadow color={'white'} position={[posX, posY, posZ]} intensity={sceneSnap.display.quest === core.openingText ? dLightIntensity : 0} />
            </>
        )
    }


    const Effect = (props) => {
        return (
            core.isMobile
                ? props.children
                : <Selection>
                    <EffectComposer>
                        <SelectiveBloom lights={[dLight]} kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.2} />
                    </EffectComposer>
                    <Select enabled>
                        {props.children}
                    </Select>
                </Selection>
        )
    }


    const Quest = ({ text, index }) => {
        const sceneSnap = useSnapshot(STScene)

        const setDisplay = (e, index) => {
            e.stopPropagation()

            if (!core.isMobile) {
                STScene.display = { quest: e.object.quest, author: e.object.author }
                STScene.quests[index].effect = false
                ws.send(JSON.stringify({ command: 'DISP_LBL', room: [STApp.userRoom, STApp.adminRoom], display: STScene.display, index }))
            }
        }


        return (
            <Float floatIntensity={2} speed={1} position={text.pos} onClick={(e) => setDisplay(e, index)}>
                <Center>
                    <Center>
                        <Text3D font={'/fonts/json/inter_regular.json'} quest={text.label} author={text.username} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                            {wrap(text.label, 4)}
                            <meshStandardMaterial attach='material' color={text.color} emissive={text.color} emissiveIntensity={sceneSnap.display.quest === core.openingText ? 1 : 0} toneMapped={false} />
                        </Text3D>
                    </Center>

                    <Center>
                        <mesh rotation={[0, 0, Math.PI / 2]} quest={text.label} author={text.username} >
                            <planeGeometry args={[0.3 * text.label.length / 13, clamp(4 * text.label.length / 17, 0, 6)]} />
                            <meshStandardMaterial opacity={0} transparent />
                        </mesh>
                    </Center>

                    {/* <mesh rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.2, 0.6, 5, 20]} />
                    </mesh> */}
                </Center>
            </Float>
        )
    }


    const Quests = () => {
        const sceneSnap = useSnapshot(STScene)


        return (
            <>
                <Effect>
                    {sceneSnap.quests.map((text, index) => { return text.effect && <Quest text={text} index={index} key={index} /> })}
                </Effect>

                {sceneSnap.quests.map((text, index) => { return !text.effect && <Quest text={text} index={index} key={index} /> })}
            </>
        )
    }


    const Display = () => {
        const sceneSnap = useSnapshot(STScene)


        return (
            <Center>
                <Text3D font={'/fonts/json/inter_regular.json'} bevelEnabled bevelSize={0.03} size={0.5} height={0.03} position={[0, 2, 0]}>
                    {sceneSnap.display.author}
                    <meshNormalMaterial />
                </Text3D>
                <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled bevelSize={0.05} height={0.05}>
                    {wrap(sceneSnap.display.quest, 4)}
                    <meshNormalMaterial />
                </Text3D>
            </Center>
        )
    }


    const Indicators = () => {
        const sceneSnap = useSnapshot(STScene)


        return (
            <>
                {Object.keys(sceneSnap.indicators).map((key, index) => {
                    return (
                        <Float floatIntensity={2} speed={1} position={sceneSnap.indicators[key].pos} key={index}>
                            <Center>
                                <Text3D font={'/fonts/json/inter_regular.json'} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                                    {sceneSnap.indicators[key].username + '. . .'}
                                    <meshStandardMaterial attach='material' color={sceneSnap.indicators[key].color} emissive={sceneSnap.indicators[key].color} emissiveIntensity={1} toneMapped={false} />
                                </Text3D>
                            </Center>
                        </Float>
                    )
                })}
            </>
        )
    }


    return (
        <Canvas>
            <CamnCon />
            <Light />
            <Display />
            <Quests />
            <Indicators />
        </Canvas>
    )
}