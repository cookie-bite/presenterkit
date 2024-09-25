import { useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'

import sty from './segment.module.css'


export const Segment = ({ segments, labels, state, onChange }) => {
    const [index, setIndex] = useState(segments.indexOf(state))
    const id = useId()


    useEffect(() => onChange(index, segments[index]), [index])

    useEffect(() => setIndex(segments.indexOf(state)), [state])


    return (
        <div className={sty.segments}>
            {labels.map((label, i) => {
                return (
                    <button className={sty.segment} key={i} onClick={() => setIndex(i)}>
                        {index === i && <motion.div layoutId={id} className={sty.segmentBg}></motion.div>}
                        {label}
                    </button>
                )
            })}
        </div>
    )
}