import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { STUsers } from '../stores/app.store'

import { calcRows } from '../utilities/core.utils'


export const CamCon = ({ core }) => {
    const camera = useRef()
    const controls = useRef()

    const orbitOptions = {
        // maxPolarAngle: Math.PI / 2,
        // maxAzimuthAngle: Math.PI / 4,
        // minAzimuthAngle: -Math.PI / 4
    }

    const zoomOut = core.isMobile ? [3.5] : [1]


    const camPos = (row) => {
        if (row === 1) return 24
        return camPos(row - 1) + (row / 2) + 1
    }


    useEffect(() => {
        gsap.to(camera.current.position, { duration: 2.5, delay: 0.5, x: 0, y: 0, z: camPos(calcRows(STUsers.list.length)) * zoomOut[0] })
    }, [])


    return (
        <>
            <PerspectiveCamera ref={camera} position={[0, 0, -4]} fov={30} near={0.01} far={1500} makeDefault />
            <OrbitControls ref={controls} {...orbitOptions} />
        </>
    )
}