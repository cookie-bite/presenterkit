import { Environment, Float, Lightformer } from '@react-three/drei'


export const Env = () => {
    return (
        <Environment frames={Infinity} resolution={256}>
            <Float speed={2} floatIntensity={10} rotationIntensity={2}>
                <Lightformer form={'circle'} intensity={1} position={[0, 30, -6]} rotation={[-Math.PI / 2, 0, 0]} scale={[60, 60, 0]} target={[0, 0, 0]} />
            </Float>
        </Environment>
    )
}