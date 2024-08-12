import { useEffect, useRef } from 'react'
import { Center, Float, Text3D } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSnapshot } from 'valtio'
import { STQuests, STUsers } from '../stores/app.store'
import { STChat, STTyping } from '../stores/scene.store'
import * as THREE from 'three'

import { calcRows } from '../utilities/core.utils'


const User = ({ user, position }) => {
    const userRef = useRef()
    const lightRef = useRef()
    const bubbleRef = useRef()

    const lod = 32
    const inLobby = user.isInLobby


    const onPointerOver = (event) => {
        if (inLobby) return
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
        gsap.to(userRef.current.position, { duration: 0.5, y: 1 })
        if (bubbleRef.current) {
            gsap.to(lightRef.current, { duration: 0.5, distance: 10 })
            gsap.to(bubbleRef.current.scale, { duration: 0.5, x: 1.2, y: 1.2, z: 1.2 })
            gsap.to(bubbleRef.current.material.color, { duration: 0.5, r: 1, g: 0.84, b: 0.04 })
        }
    }

    const onPointerOut = (event) => {
        if (inLobby) return
        event.stopPropagation()
        document.body.style.cursor = 'default'
        gsap.to(userRef.current.position, { duration: 0.5, y: 0 })
        if (bubbleRef.current) {
            gsap.to(lightRef.current, { duration: 0.5, distance: 1 })
            gsap.to(bubbleRef.current.scale, { duration: 0.5, x: 1, y: 1, z: 1 })
            gsap.to(bubbleRef.current.material.color, { duration: 0.5, r: 1, g: 1, b: 1 })
        }
    }


    const Message = () => {
        const SSChat = useSnapshot(STChat)


        const Stadium = () => {

            console.log('stadium')

            const stadiumRef = useRef()

            const quest = STChat.queue[user.userID][0]

            const label = quest.label.length < 35 ? quest.label : quest.label.slice(0, 30) + '...'
            const textLength = label.length * 0.108

            const shape = new THREE.Shape()

            shape.absarc(-textLength, 2, 0.4, - Math.PI / 2, Math.PI / 2, true)
            shape.absarc(textLength, 2, 0.4, Math.PI / 2, - Math.PI / 2, true)

            const extrude = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.03, bevelThickness: 0.02 }
            const stadiumGeo = new THREE.ExtrudeGeometry(shape, extrude)


            useEffect(() => {
                if (STChat.queue.hasOwnProperty(user.userID)) {
                    gsap.fromTo(stadiumRef.current.scale, { x: 0, y: 0, z: 0 }, { duration: 0.9, delay: 0.3, x: 1, y: 1, z: 1 })
                    gsap.fromTo(stadiumRef.current.position, { x: 0, y: 0.8, z: 0 }, { duration: 0.9, delay: 0.3, x: 0, y: -0.4, z: 0 })

                    gsap.to(stadiumRef.current.scale, { duration: 0.9, delay: 9, x: 0, y: 0, z: 0 })
                    gsap.to(stadiumRef.current.position, { duration: 0.9, delay: 9, x: 0, y: 0.8, z: 0 })

                    setTimeout(() => { if (STChat.queue[user.userID].length > 0) STChat.queue[user.userID].shift() }, 10000)
                }
            }, [STChat.queue[user.userID]])


            return (
                <Float speed={10} floatIntensity={0.8} rotationIntensity={0}>
                    <group name='stadium' ref={stadiumRef}>
                        <mesh geometry={stadiumGeo}>
                            <meshStandardMaterial color={'#ffffff'} />
                        </mesh>
                        <Center position={[0, 2, 0.12]}>
                            <Text3D font={'/fonts/json/inter_semi_bold.json'} bevelEnabled={false} bevelSize={0.03} size={0.3} height={0.1}>
                                {label}
                                <meshStandardMaterial color={quest.color} />
                            </Text3D>
                        </Center>
                    </group>
                </Float>
            )
        }


        const Bubble = () => {
            console.log('bubble')

            useEffect(() => {
                gsap.fromTo(bubbleRef.current.scale, { x: 0, y: 0, z: 0 }, { duration: 0.5, x: 1, y: 1, z: 1 })
                gsap.fromTo(bubbleRef.current.position, { x: 0, y: 0.4, z: 0 }, { duration: 0.5, x: 0, y: 0.85, z: 0 })
            }, [])


            return (
                <Float speed={10} floatIntensity={0.8} rotationIntensity={0}>
                    <group name='bubble'>
                        <mesh ref={bubbleRef}>
                            <sphereGeometry args={[0.1, lod, lod]} />
                            <meshStandardMaterial color={'#ffffff'} metalness={0.2} roughness={0} />
                        </mesh>
                        <pointLight ref={lightRef} color={'#ffd60a'} distance={1} intensity={8} />
                    </group>
                </Float>
            )
        }


        console.log('message')


        return (
            <>
                {(SSChat.queue.hasOwnProperty(user.userID) && SSChat.queue[user.userID]?.length > 0) && <Stadium />}
                {STQuests.list.findIndex(q => q.userID === user.userID) !== -1 && <Bubble />}
            </>
        )
    }


    const Indicator = () => {
        const SSTyping = useSnapshot(STTyping)
        const SSChat = useSnapshot(STChat)

        if (!SSTyping.indicators.hasOwnProperty(user.userID)) return
        if (SSChat.queue[user.userID]?.length) return


        return (
            <group>
                <Float speed={20} floatIntensity={0.8} rotationIntensity={0}>
                    <group position={[-0.23, 0.8, 0]}>
                        <mesh name='bubble'>
                            <sphereGeometry args={[0.07, lod, lod]} />
                            <meshStandardMaterial color={'#ffffff'} metalness={0.2} roughness={0} />
                        </mesh>
                    </group>
                </Float>
                <Float speed={20} floatIntensity={0.8} rotationIntensity={0}>
                    <group position={[0, 0.8, 0]}>
                        <mesh name='bubble'>
                            <sphereGeometry args={[0.07, lod, lod]} />
                            <meshStandardMaterial color={'#ffffff'} metalness={0.2} roughness={0} />
                        </mesh>
                    </group>
                </Float>
                <Float speed={20} floatIntensity={0.8} rotationIntensity={0}>
                    <group position={[0.23, 0.8, 0]}>
                        <mesh name='bubble'>
                            <sphereGeometry args={[0.07, lod, lod]} />
                            <meshStandardMaterial color={'#ffffff'} metalness={0.2} roughness={0} />
                        </mesh>
                    </group>
                </Float>
            </group>
        )
    }


    const Body = () => {
        const Material = () => {
            if (inLobby) return <meshStandardMaterial color={user.userColor} opacity={0.08} transparent />
            return <meshStandardMaterial color={user.userColor} metalness={0.2} roughness={0} />
        }


        return (
            <group>
                {!inLobby && <mesh name='collision' position={[0, -0.7, 0]}>
                    <cylinderGeometry args={[0.5, 0.9, 2.4, lod]} />
                    <meshStandardMaterial opacity={0} transparent />
                </mesh>}
                <mesh name='head' position={[0, 0, 0]}>
                    <sphereGeometry args={[0.5, lod, lod]} />
                    <Material />
                </mesh>
                <mesh name='body' position={[0, -1.5, 0]}>
                    <sphereGeometry args={[0.8, lod, lod, , , , Math.PI / 2]} />
                    <Material />
                </mesh>
                <mesh name='bottom' position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.8, lod]} />
                    <Material />
                </mesh>
            </group>
        )
    }


    return (
        <group position={position} onPointerOver={(e) => onPointerOver(e)} onPointerOut={(e) => onPointerOut(e)}>
            <group ref={userRef}>
                <Message />
                <Indicator />
                <Body />
            </group>
        </group>
    )
}


export const Users = () => {
    const SSUsers = useSnapshot(STUsers)

    let row = 0
    let rowIndex = -1
    let userCount = 7


    return (
        SSUsers.list.map((user, index) => {
            if (index >= userCount) { row += 1; userCount += 7 + 2 * row; rowIndex = 0; } else rowIndex++

            const pos = (x) => {
                return [
                    /* Pos X */ +(1.2 * (x % 2 ? -x - 1 : x)).toFixed(3),
                    /* Pos Y */ +(-2 - 0.65 * (calcRows(SSUsers.list.length) - 1) + 1.3 * row).toFixed(3),
                    /* Pos Z */ +(8 - Math.sqrt((8 + 2 * row) ** 2 - (x === 0 || x % 2 ? x : x - 1) ** 2)).toFixed(3)
                ]
            }


            return user && <User user={user} position={pos(rowIndex)} key={index} />
        })
    )
}