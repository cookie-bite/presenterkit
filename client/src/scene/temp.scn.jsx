

const Quest = ({ text, index }) => {
    const SSDisplay = useSnapshot(STDisplay)

    const setDisplay = (e, index) => {
        e.stopPropagation()

        if (!core.isMobile) {
            Object.assign(STDisplay, { quest: e.object.quest, author: e.object.author })
            STQuests.list[index].effect = false
            ws.send(JSON.stringify({ command: 'DISP_LBL', eventID: STEvent.id, display: STDisplay, index }))
        }
    }


    return (
        <Float floatIntensity={2} speed={1} position={text.pos} onClick={(e) => setDisplay(e, index)}>
            <Center>
                <Center>
                    <Text3D font={'/fonts/json/inter_regular.json'} quest={text.label} author={text.username} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                        {wrap(text.label, 4)}
                        <meshStandardMaterial attach='material' color={text.color} emissive={text.color} emissiveIntensity={SSDisplay.quest === core.openingText ? 1 : 0} toneMapped={false} />
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
    const SSQuests = useSnapshot(STQuests)


    return (
        <>
            <Effects core={core}>
                {SSQuests.list.map((text, index) => { return text.effect && <Quest text={text} index={index} key={index} /> })}
            </Effects>

            {SSQuests.list.map((text, index) => { return !text.effect && <Quest text={text} index={index} key={index} /> })}
        </>
    )
}



const Indicators = () => {
    const SSTyping = useSnapshot(STTyping)


    return (
        <>
            {Object.keys(SSTyping.indicators).map((key, index) => {
                return (
                    <Float floatIntensity={2} speed={1} position={SSTyping.indicators[key].pos} key={index}>
                        <Center>
                            <Text3D font={'/fonts/json/inter_regular.json'} size={0.3} bevelEnabled={false} bevelSize={0.05} height={0.06} >
                                {SSTyping.indicators[key].username + '. . .'}
                                <meshStandardMaterial attach='material' color={SSTyping.indicators[key].color} emissive={SSTyping.indicators[key].color} emissiveIntensity={1} toneMapped={false} />
                            </Text3D>
                        </Center>
                    </Float>
                )
            })}
        </>
    )
}