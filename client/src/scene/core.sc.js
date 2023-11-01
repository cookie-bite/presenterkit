import { useRef, useEffect } from 'react'
import { OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useControl, Controls } from 'react-three-gui'
import { gsap } from 'gsap'
import { useSnapshot } from 'valtio'
import { STApp, STScene } from '../stores/app.store'
import { clamp, wrap, genColor } from '../utilities/core.utils'


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
                {true && <Controls title='Settings' />}
            </Controls.Provider>
        )
    }


    const CamCon = () => {
        const appSnap = useSnapshot(STApp)

        const camera = useRef()
        const controls = useRef()

        const posX = useControl('Pos X', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Pos', value: 25, min: -10, max: 100 })

        const users = 16 || appSnap.userList.length
        const rows = Math.ceil(Math.sqrt(users + 9) - 3)

        const orbitOptions = {
            // maxPolarAngle: Math.PI / 2,
            // maxAzimuthAngle: Math.PI / 4,
            // minAzimuthAngle: -Math.PI / 4
        }

        // useEffect(() => {
        //     if (!controls.current || !camera.current) return

        //     // camera.current.position.set(0, 3, 4)
        //     controls.current.target.set(0, 1, 0)
        // }, [camera, controls])


        return (
            <>
                <PerspectiveCamera ref={camera} position={[posX, posY, core.isMobile ? 80 : posZ]} fov={30} near={0.01} far={1500} makeDefault />
                <OrbitControls ref={controls} {...orbitOptions} />
            </>
        )
    }


    const Light = () => {
        const sceneSnap = useSnapshot(STScene)

        // useHelper(dLight, DirectionalLightHelper, 0.5, 'teal')
        const dLightIntensity = useControl('D Intensity', { type: 'number', group: 'Light', value: 0.7, min: 0, max: 1 })
        const aLightIntensity = useControl('A Intensity', { type: 'number', group: 'Light', value: 0.4, min: 0, max: 2 })

        const posX = useControl('Pos X', { type: 'number', group: 'Light', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Light', value: 5, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Light', value: 4, min: -10, max: 10 })

        return (
            <>
                <color attach='background' args={['#141622']} />
                <ambientLight intensity={aLightIntensity} />
                <directionalLight ref={dLight} castShadow color={'white'} position={[posX, posY, posZ]} intensity={dLightIntensity} />
                {/* <ambientLight intensity={sceneSnap.display.quest === core.openingText ? aLightIntensity : 0.04} /> */}
                {/* <directionalLight ref={dLight} castShadow color={'white'} position={[posX, posY, posZ]} intensity={sceneSnap.display.quest === core.openingText ? dLightIntensity : 0} /> */}
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
        const appSnap = useSnapshot(STApp)
        const sceneSnap = useSnapshot(STScene)

        const users = 16 || appSnap.userList.length
        const rows = Math.ceil(Math.sqrt(users + 9) - 3)

        const posY = useControl('Pos Y', { type: 'number', group: 'Display', value: 2.7 + 0.65 * rows, min: 0, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Display', value: 0, min: 0, max: 10 })


        return (
            <group position={[0, posY, posZ]}>
                <Center>
                    <Text3D font={'/fonts/json/inter_regular.json'} bevelEnabled bevelSize={0.03} size={0.5} height={0.03}>
                        {sceneSnap.display.author}
                        <meshNormalMaterial />
                    </Text3D>
                    <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled bevelSize={0.05} height={0.05}>
                        {wrap(sceneSnap.display.quest, 4)}
                        <meshNormalMaterial />
                    </Text3D>
                </Center>
            </group>
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


    const User = ({ user, position }) => {
        const userRef = useRef()
        const lightRef = useRef()
        const bubbleRef = useRef()

        const lod = 32
        const haveQuest = Math.round(Math.random())
        const color = genColor()


        const onPointerOver = (event) => {
            event.stopPropagation()
            document.body.style.cursor = 'pointer'
            gsap.to(userRef.current.position, { duration: 0.5, y: 1 })
            if (haveQuest) {
                gsap.to(lightRef.current, { duration: 0.5, distance: 10 })
                gsap.to(bubbleRef.current.scale, { duration: 0.5, x: 1.2, y: 1.2, z: 1.2 })
                gsap.to(bubbleRef.current.material.color, { duration: 0.5, r: 1, g: 0.84, b: 0.04 })
            }
        }

        const onPointerOut = (event) => {
            event.stopPropagation()
            document.body.style.cursor = 'default'
            gsap.to(userRef.current.position, { duration: 0.5, y: 0 })
            if (haveQuest) {
                gsap.to(lightRef.current, { duration: 0.5, distance: 1 })
                gsap.to(bubbleRef.current.scale, { duration: 0.5, x: 1, y: 1, z: 1 })
                gsap.to(bubbleRef.current.material.color, { duration: 0.5, r: 1, g: 1, b: 1 })
            }
        }


        const Material = () => <meshStandardMaterial color={color || user.userColor} metalness={0.2} roughness={0} />


        return (
            <group position={position} onPointerOver={(e) => onPointerOver(e)} onPointerOut={(e) => onPointerOut(e)}>
                <group ref={userRef}>
                    {haveQuest && <group position={[0, 0.8, 0]}>
                        <Float speed={10} floatIntensity={0.8} rotationIntensity={0}>
                            <mesh ref={bubbleRef}>
                                <sphereGeometry args={[0.1, lod, lod]} />
                                <meshStandardMaterial color={'#ffffff'} metalness={0.2} roughness={0} />
                            </mesh>
                            <pointLight ref={lightRef} color={'#ffd60a'} distance={1} intensity={8} />
                        </Float>
                    </group>}
                    <mesh position={[0, -0.7, 0]}>
                        <cylinderGeometry args={[0.5, 0.9, 2.4, lod]} />
                        <meshStandardMaterial opacity={0} transparent />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.5, lod, lod]} />
                        <Material />
                    </mesh>
                    <mesh position={[0, -1.5, 0]}>
                        <sphereGeometry args={[0.8, lod, lod, , , , Math.PI / 2]} />
                        <Material />
                    </mesh>
                    <mesh position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.8, lod]} />
                        <Material />
                    </mesh>
                </group>
            </group>
        )
    }


    const Users = () => {
        const appSnap = useSnapshot(STApp)

        const users = 16 || appSnap.userList.length
        const rows = Math.ceil(Math.sqrt(users + 9) - 3)

        let row = 0
        let rowIndex = -1
        let userCount = 7


        return (
            Array(users).fill().map((user, index) => {
                if (index >= userCount) { row += 1; userCount += 7 + 2 * row; rowIndex = 0; } else rowIndex++

                const pos = (x) => {
                    return [
                        /* Pos X */ +(1.2 * (x % 2 ? -x - 1 : x)).toFixed(3),
                        /* Pos Y */ +(-2 - 0.65 * (rows - 1) + 1.3 * row).toFixed(3),
                        /* Pos Z */ +(8 - Math.sqrt((8 + 2 * row) ** 2 - (x === 0 || x % 2 ? x : x - 1) ** 2)).toFixed(3)
                    ]
                }


                return <User user={user} position={pos(rowIndex)} key={index} />
            })
        )
    }


    return (
        <Canvas>
            <CamCon />
            <Light />
            <Display />
            {/* <Quests /> */}
            {/* <Indicators /> */}
            <Users />
        </Canvas>
    )
}