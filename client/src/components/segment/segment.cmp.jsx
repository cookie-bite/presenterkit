import { useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'

import sty from './segment.module.css'


export const Segment = ({ segments, state, onChange }) => {
    const [index, setIndex] = useState(segments.indexOf(state))
    const id = useId()


    useEffect(() => onChange(index, segments[index]), [index])

    useEffect(() => setIndex(segments.indexOf(state)), [state])


    return (
        <div className={sty.segments}>
            {segments.map((segment, i) => {
                return (
                    <div className={sty.segment} key={i} onClick={() => setIndex(i)}>
                        {index === i && <motion.div layoutId={id} className={sty.segmentBg}></motion.div>}
                        <h4 className={sty.segmentLbl} style={{ color: index === i ? 'var(--black)' : 'var(--primary-label)' }}>{segment}</h4>
                    </div>
                )
            })}
        </div>
    )
}