import { useRef, useEffect } from 'react'
import { OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useControl } from 'react-three-gui'
import { proxy, useSnapshot } from 'valtio'
import { STApp } from '../stores/app.store'


export const Scene = ({ ws, core }) => {
    const openingText = 'Welcome to WWDC23'

    const state = proxy({
        texts: [],
        activeText: openingText,
        activeUser: ''
    })

    const questions = [
        'What languages do you speak?',
        'What\'s an unpopular opinion you have?',
        'What\'s the worst movie you\'ve ever seen?',
        'What\'s one of your favorite comfort foods?',
        'What\'s the story behind one of your scars?',
        'What is something you can never seem to finish?',
        'Do you ever sing when you\'re alone? What songs?',
        'In your group of friends, what role do you play?',
        'What\'s your favorite piece of clothing you own?',
        'What have you created that you are most proud of?',
        'If you were a vegetable, what vegetable would you be?',
        'What would you do on a free afternoon in the middle of the week?',
        'Who is one of your best friends, and what do you love about them?',
        'When was the last time you changed your opinion about something major?',
        'SABAH Vll Karyera Qış Məktəbində psixologiya üzrə fəlsəfə elmlər doktoru',
        'What incredibly strong opinion do you have that is completely unimportant in the grand scheme of things?'
    ]

    const dLight = useRef()

    ws.onmessage = (wsData) => {
        const data = JSON.parse(wsData.data)
        console.log(data)

        if (data.command === 'INIT_WS') {
            STApp.userId = data.user.id
            STApp.userName = data.user.name
            if (data.texts.length) {
                genQuest(data.texts)
                state.activeText = data.active.text
                state.activeUser = data.active.user
            }
        } else if (data.command === 'NEW_MSG') {
            state.texts = [...state.texts, {
                color: data.message.color,
                sentence: data.message.sentence,
                username: data.message.username,
                pos: core.isMobile ? data.message.pos.mobile : data.message.pos.web
            }]
        } else if (data.command === 'ACT_TXT') {
            state.activeText = data.text
            state.activeUser = data.user
        }
    }

    // const checkIsMobile = () => {
    //     try {
    //         document.createEvent('TouchEvent'); state.isMobile = true
    //     } catch (e) {
    //         state.isMobile = false
    //     }
    // }

    // const genText = () => {
    //     let sentence = ''

    //     for (let i = 0; i < (3 + Math.floor(Math.random() * 30)); i++) {
    //         let result = ''
    //         for (let j = 0; j < (3 + Math.floor(Math.random() * 4)); j++) {
    //             result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
    //         }
    //         sentence += (result + ' ')
    //         const limiter = stateSnap.isMobile ? 4 : 6
    //         if (i !== 0 && i % limiter === 0) sentence += '\n'
    //     }
    //     sentence = sentence.trim()
    // }

    const genQuest = (arr) => {
        let demo = []

        arr.map((q) => {
            demo.push({
                color: q.color,
                sentence: q.sentence,
                username: q.username,
                pos: core.isMobile ? q.pos.mobile : q.pos.web
            })
        })

        state.texts = demo
    }


    useEffect(() => {
        // checkIsMobile()
        // genQuest(questions)

        // if (document.documentElement.requestFullscreen) {
        //     document.documentElement.requestFullscreen()
        // } else if (document.documentElement.webkitRequestFullscreen) {
        //     document.documentElement.webkitRequestFullscreen()
        // }

        const onKeyUp = (e) => {
            if (e.key === 'Escape' || e.code === 'Escape') {
                state.activeText = openingText
                state.activeUser = ''
                ws.send(JSON.stringify({ command: 'ACT_TXT', text: openingText, user: '' }))
            }
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [])


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
        // useHelper(dLight, DirectionalLightHelper, 0.5, "teal")
        const dLightIntensity = useControl('D Intensity', { type: 'number', group: 'Light', value: 1, min: 0.01, max: 1 })
        const aLightIntensity = useControl('A Intensity', { type: 'number', group: 'Light', value: 1, min: 0.01, max: 2 })

        const posX = useControl('Pos X', { type: 'number', group: 'Light', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Light', value: 5, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Light', value: 4, min: -10, max: 10 })

        return (
            <>
                <ambientLight intensity={aLightIntensity} />
                <directionalLight ref={dLight} castShadow color={'white'} position={[posX, posY, posZ]} intensity={dLightIntensity} />
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


    const Text = () => {
        const stateSnap = useSnapshot(state)

        const wrap = (text) => {
            let temp = 0
            return [...text].map(c => { if (c === ' ') { if (temp === 4) { temp = 0; return '\n' } else temp++; return c } else return c }).join('')
        }

        const setActiveText = (e) => {
            e.stopPropagation()

            if (!core.isMobile) {
                state.activeText = e.object.text
                state.activeUser = e.object.username
                ws.send(JSON.stringify({ command: 'ACT_TXT', text: e.object.text, user: e.object.username }))
            }
        }

        const clamp = (a, n, x) => { return a <= n ? n : a >= x ? x : a }

        return (
            <>
                <Center>
                    <Text3D font={'/fonts/json/inter_regular.json'} bevelEnabled bevelSize={0.05} size={0.5} position={[0, 2, 0]}>
                        {stateSnap.activeUser}
                        <meshNormalMaterial />
                    </Text3D>
                    <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled bevelSize={0.05}>
                        {wrap(stateSnap.activeText)}
                        <meshNormalMaterial />
                    </Text3D>
                </Center>
                <Effect>
                    {stateSnap.texts.map((text, index) => {
                        return (
                            <Float floatIntensity={2} speed={1} position={text.pos} key={index} onClick={(e) => setActiveText(e)}>
                                <Center>
                                    <Center>
                                        <Text3D font={'/fonts/json/inter_regular.json'} text={text.sentence} username={text.username} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                                            {wrap(text.sentence)}
                                            <meshStandardMaterial attach="material" color={text.color} emissive={text.color} emissiveIntensity={1} toneMapped={false} />
                                        </Text3D>
                                    </Center>

                                    <Center>
                                        <mesh rotation={[0, 0, Math.PI / 2]} text={text.sentence} username={text.username} >
                                            <planeGeometry args={[0.3 * text.sentence.length / 13, clamp(4 * text.sentence.length / 17, 0, 6)]} />
                                            <meshStandardMaterial opacity={0} transparent />
                                        </mesh>
                                    </Center>

                                    {/* <mesh rotation={[0, 0, Math.PI / 2]}>
                                        <capsuleGeometry args={[0.2, 0.6, 5, 20]} />
                                        <meshStandardMaterial attach="material" color={text.color} emissive={text.color} emissiveIntensity={1} toneMapped={false} />
                                    </mesh> */}
                                </Center>
                            </Float>
                        )
                    })}
                </Effect>
            </>
        )
    }


    return (
        <>
            <CamnCon />
            <Light />
            <Text />
        </>
    )
}