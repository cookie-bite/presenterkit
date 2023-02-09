import { useRef, useEffect, useState } from 'react'
import { useHelper, OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useControl } from 'react-three-gui'
import { DirectionalLightHelper } from 'three'


const ws = new WebSocket(`ws://${window.location.hostname}:3000`)

export const Scene = () => {
    const [isMobile, setIsMobile] = useState(null)
    const [texts, setTexts] = useState([])
    const [activeText, setActiveText] = useState('What is your pain point?')

    const [userId, setUserId] = useState([])

    const dLight = useRef()

    const colorsArray = [
        "63b598", "ce7d78", "ea9e70", "a48a9e", "c6e1e8", "648177", "0d5ac1",
        "f205e6", "1c0365", "14a9ad", "4ca2f9", "a4e43f", "d298e2", "6119d0",
        "d2737d", "c0a43c", "f2510e", "651be6", "79806e", "61da5e", "cd2f00",
        "9348af", "01ac53", "c5a4fb", "996635", "b11573", "4bb473", "75d89e",
        "2f3f94", "2f7b99", "da967d", "34891f", "b0d87b", "ca4751", "7e50a8",
        "c4d647", "e0eeb8", "11dec1", "289812", "566ca0", "ffdbe1", "2f1179",
        "935b6d", "916988", "513d98", "aead3a", "9e6d71", "4b5bdc", "0cd36d",
        "250662", "cb5bea", "228916", "ac3e1b", "df514a", "539397", "880977",
        "f697c1", "ba96ce", "679c9d", "c6c42c", "5d2c52", "48b41b", "e1cf3b",
        "5be4f0", "57c4d8", "a4d17a", "225b8f", "be608b", "96b00c", "088baf",
        "f158bf", "e145ba", "ee91e3", "05d371", "5426e0", "4834d0", "802234",
        "6749e8", "0971f0", "8fb413", "b2b4f0", "c3c89d", "c9a941", "41d158",
        "fb21a3", "51aed9", "5bb32d", "807fbf", "21538e", "89d534", "d36647",
        "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
        "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
        "1bb699", "6b2e5f", "64820f", "1c271f", "21538e", "89d534", "d36647",
        "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
        "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
        "1bb699", "6b2e5f", "64820f", "1c271f", "9cb64a", "996c48", "9ab9b7",
        "06e052", "e3a481", "0eb621", "fc458e", "b2db15", "aa226d", "792ed8",
        "73872a", "520d3a", "cefcb8", "a5b3d9", "7d1d85", "c4fd57", "f1ae16",
        "8fe22a", "ef6e3c", "243eeb", "1dc18f", "dd93fd", "3f8473", "e7dbce",
        "421f79", "7a3d93", "635f6d", "93f2d7", "9b5c2a", "15b9ee", "0f5997",
        "409188", "911e20", "1350ce", "10e5b1", "fff4d7", "cb2582", "ce00be",
        "32d5d6", "17232f", "608572", "c79bc2", "00f87c", "77772a", "6995ba",
        "fc6b57", "f07815", "8fd883", "060e27", "96e591", "21d52e", "d00043",
        "b47162", "1ec227", "4f0f6f", "1d1d58", "947002", "bde052", "e08c56",
        "28fcfd", "bb09bf", "36486a", "d02e29", "1ae6db", "3e464c", "a84a8f",
        "911e7e", "3f16d9", "0f525f", "ac7c0a", "b4c086", "c9d730", "30cc49",
        "3d6751", "fb4c03", "640fc1", "62c03e", "d3493a", "88aa0b", "406df9",
        "615af0", "4be47f", "2a3434", "4a543f", "79bca0", "a8b8d4", "00efd4",
        "7ad236", "7260d8", "1deaa7", "06f43a", "823c59", "e3d94c", "dc1c06",
        "f53b2a", "b46238", "2dfff6", "a82b89", "1a8011", "436a9f", "1a806a",
        "4cf09d", "c188a2", "67eb4b", "b308d3", "fc7e41", "af3101", "ff065f",
        "71b1f4", "a2f8a5", "e23dd0", "d3486d", "00f7f9", "474893", "3cec35",
        "1c65cb", "5d1d0c", "2d7d2a", "ff3420", "5cdd87", "a259a4", "e4ac44",
        "1bede6", "8798a4", "d7790f", "b2c24f", "de73c2", "d70a9c", "25b67f",
        "88e9b8", "c2b0e2", "86e98f", "ae90e2", "1a806b", "436a9e", "0ec0ff",
        "f812b3", "b17fc9", "8d6c2f", "d3277a", "2ca1ae", "9685eb", "8a96c6",
        "dba2e6", "76fc1b", "608fa4", "20f6ba", "07d7f6", "dce77a", "77ecca"
    ]

    ws.onopen = () => console.log('WebSocket Client Connected' + ws.readyState)

    ws.onmessage = ({ data }) => {
        console.log('got reply!', JSON.parse(data).message)


        setTexts([...texts, {
            sentence: JSON.parse(data).message,
            pos: isMobile
                ? [
                    Math.random() * (3 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (8 + texts.length / 2.5)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ]
                : [
                    Math.random() * (10 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (texts.length / 3)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ],
            color: `#${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`
        }])
    }

    const checkIsMobile = () => {
        try {
            document.createEvent('TouchEvent')
            setIsMobile(true)
        } catch (e) {
            setIsMobile(false)
        }
    }

    const genText = () => {
        let sentence = ''

        for (let i = 0; i < (3 + Math.floor(Math.random() * 30)); i++) {
            let result = ''
            for (let j = 0; j < (3 + Math.floor(Math.random() * 4)); j++) {
                result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
            }
            sentence += (result + ' ')
            const limiter = isMobile ? 4 : 6
            if (i !== 0 && i % limiter === 0) sentence += '\n'
        }
        sentence = sentence.trim()

        setTexts([...texts, {
            sentence,
            pos: isMobile
                ? [
                    Math.random() * (3 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (8 + texts.length / 2.5)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ]
                : [
                    Math.random() * (10 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (texts.length / 3)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ],
            color: `#${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`
        }])
    }


    useEffect(() => {
        if (isMobile === null) checkIsMobile()
        // if (texts.length < 30) setTimeout(() => genText(), 3000)
        // fetch('http://localhost:3000/api').then(res => res.json()).then(res => console.log({ res: res.message }))
    }, [texts])


    const CamnCon = () => {
        const camera = useRef()
        const controls = useRef()

        const posX = useControl('Pos X', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Pos', value: 14, min: -10, max: 50 })


        useEffect(() => {
            if (!controls.current || !camera.current) return

            // camera.current.position.set(0, 3, 4)
            controls.current.target.set(0, 1, 0)
        }, [camera, controls, isMobile])


        return (
            <>
                <PerspectiveCamera ref={camera} position={[posX, posY, isMobile ? 45 : 14]} fov={50} near={0.01} far={1500} makeDefault />
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


    const Text = () => {
        const kernelSize = useControl('Kerner', { type: 'number', group: 'Effect', value: 3, min: 0, max: 5 })
        const luminanceThreshold = useControl('Threshold', { type: 'number', group: 'Effect', value: 0, min: 0, max: 2 })
        const luminanceSmoothing = useControl('Smoothing', { type: 'number', group: 'Effect', value: 0.4, min: 0, max: 2 })
        const intensity = useControl('Intensity', { type: 'number', group: 'Effect', value: 0.2, min: 0, max: 2 })


        return (
            <>
                <Center>
                    <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled bevelSize={0.05}>
                        {activeText}
                        <meshNormalMaterial />
                    </Text3D>
                </Center>
                <Selection>
                    <EffectComposer>
                        <SelectiveBloom lights={[dLight]} kernelSize={kernelSize} luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} intensity={intensity} />
                    </EffectComposer>
                    <Select enabled>
                        {texts.map((text, index) => {
                            return (
                                <Float floatIntensity={2} speed={1} position={text.pos} key={index} onClick={(e) => setActiveText(e.object.text)}>
                                    <Center>
                                        <Text3D font={'/fonts/json/inter_regular.json'} text={text.sentence} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                                            {text.sentence}
                                            <meshStandardMaterial attach="material" color={text.color} emissive={text.color} emissiveIntensity={1} toneMapped={false} />
                                        </Text3D>
                                        {/* <mesh rotation={[0, 0, Math.PI / 2]}>
                                            <capsuleGeometry args={[0.2, 0.6, 5, 20]} />
                                            <meshStandardMaterial attach="material" color={text.color} emissive={text.color} emissiveIntensity={1} toneMapped={false} />
                                        </mesh> */}
                                    </Center>
                                </Float>
                            )
                        })}
                    </Select>
                </Selection>
            </>
        )
    }


    return (
        <>
            <CamnCon />
            <Light />
            <Text />
        </>
    );
}