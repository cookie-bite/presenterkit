import { useRef, useEffect, useState } from 'react'
import { useHelper, OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useControl } from 'react-three-gui'
import { DirectionalLightHelper } from 'three'
import { proxy, useSnapshot } from 'valtio'


const ws = new WebSocket(`ws://${window.location.hostname}:3000`)

export const Scene = () => {
    const state = proxy({
        isMobile: null,
        texts: [],
        activeText: 'Welcome to WWDC23'
    })

    const dLight = useRef()

    ws.onopen = () => console.log('WebSocket Client Connected' + ws.readyState)

    ws.onmessage = ({ data }) => {
        console.log('got reply!', JSON.parse(data).message)
        const sentence = JSON.parse(data).message
        let tempColor = `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
        const colorT = tempColor.length === 7 ? tempColor : `${tempColor}f`
        const color = hslToHex(hexToHsl(colorT).h, hexToHsl(colorT).s  < 30 ? 100 - hexToHsl(colorT).s : hexToHsl(colorT).s, hexToHsl(colorT).l < 50 ? 100 - hexToHsl(colorT).l : hexToHsl(colorT).l)


        state.texts = [...state.texts, {
            color,
            sentence,
            pos: state.isMobile
                ? [
                    Math.random() * (3 + state.texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (8 + state.texts.length / 2.5)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ]
                : [
                    Math.random() * (10 + state.texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)],
                    (2 + Math.random() * (state.texts.length / 3)) * [-1, 1][Math.floor(Math.random() * 2)],
                    Math.random() * [-1, 1][Math.floor(Math.random() * 2)] - 3
                ]
        }]
    }

    const checkIsMobile = () => {
        console.log('[checkIsMobile]')
        try {
            document.createEvent('TouchEvent')
            state.isMobile = true
        } catch (e) {
            state.isMobile = false
        }
    }

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

    const hexToHsl = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        var r = parseInt(result[1], 16)
        var g = parseInt(result[2], 16)
        var b = parseInt(result[3], 16)
        r /= 255, g /= 255, b /= 255
        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var h, s, l = (max + min) / 2
        if (max == min) {
            h = s = 0 // achromatic
        } else {
            var d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6
        }

        h = Math.round(h * 360)
        s = Math.round(s * 100)
        l = Math.round(l * 100)

        return { h, s, l }
    }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }


    useEffect(() => {
        // move checkIsMobile() to App.js
        checkIsMobile()
    }, [])


    const CamnCon = () => {
        const camera = useRef()
        const controls = useRef()

        const stateSnap = useSnapshot(state)

        const posX = useControl('Pos X', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Pos', value: 0, min: -10, max: 10 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Pos', value: 80, min: -10, max: 100 })


        // useEffect(() => {
        //     if (!controls.current || !camera.current) return

        //     // camera.current.position.set(0, 3, 4)
        //     controls.current.target.set(0, 1, 0)
        // }, [camera, controls])
        
        console.log('[CamnCon] isMobile:', stateSnap.isMobile)


        return (
            <>
                <PerspectiveCamera ref={camera} position={[posX, posY, state.isMobile ? 80 : 24]} fov={30} near={0.01} far={1500} makeDefault />
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
        const kernelSize = useControl('Kerner', { type: 'number', group: 'Effect', value: 3, min: 0, max: 5 })
        const luminanceThreshold = useControl('Threshold', { type: 'number', group: 'Effect', value: 0, min: 0, max: 2 })
        const luminanceSmoothing = useControl('Smoothing', { type: 'number', group: 'Effect', value: 0.4, min: 0, max: 2 })
        const intensity = useControl('Intensity', { type: 'number', group: 'Effect', value: 0.2, min: 0, max: 2 })


        return (
            state.isMobile
                ? props.children
                : <Selection>
                    <EffectComposer>
                        <SelectiveBloom lights={[dLight]} kernelSize={kernelSize} luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} intensity={intensity} />
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
            return [...text].map(c => {
                if (c === ' ') {
                    if (temp === 4) {
                        temp = 0
                        return '\n'
                    } else {
                        temp++
                        return c
                    }
                } else return c
            }).join('')
        }


        return (
            <>
                <Center>
                    <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled bevelSize={0.05}>
                        {stateSnap.activeText}
                        <meshNormalMaterial />
                    </Text3D>
                </Center>
                <Effect>
                    {stateSnap.texts.map((text, index) => {
                        return (
                            <Float floatIntensity={2} speed={1} position={text.pos} key={index} onClick={(e) => state.activeText = e.object.text}>
                                <Center>
                                    <Text3D font={'/fonts/json/inter_regular.json'} text={text.sentence} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                                        {wrap(text.sentence)}
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