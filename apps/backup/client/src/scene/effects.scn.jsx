import { EffectComposer, Select, Selection, SelectiveBloom } from '@react-three/postprocessing'
import { useRef } from 'react'


export const Effects = ({ core, children }) => {
  const dLight = useRef()


  if (core.isMobile) return children

  return (
    <>
      <spotLight ref={dLight} intensity={0} position={[0, 10, 0]} />

      <Selection>
        <EffectComposer>
          <SelectiveBloom lights={[dLight]} kernelSize={2} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.2} />
        </EffectComposer>
        <Select enabled>
          {children}
        </Select>
      </Selection>
    </>
  )
}