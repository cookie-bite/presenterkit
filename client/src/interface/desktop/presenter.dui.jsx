import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSnapshot } from 'valtio'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { STUI, STSlide, STSlides, STTheatre, STSpinner, STEvent, STSlidePanels } from '../../stores/app.store'

import { Alert, Icon, Spinner } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


var reqTimeout = null


export const Presenter = () => {
    const SSSlide = useSnapshot(STSlide)
    const SSSlides = useSnapshot(STSlides)
    const SSSlidePanels = useSnapshot(STSlidePanels)
    const SSSpinner = useSnapshot(STSpinner)
    const SSTheatre = useSnapshot(STTheatre)
    const SSEvent = useSnapshot(STEvent)

    const inputRef = useRef()
    const pageCount = STSlides.list[STSlide.active.index]?.pageCount
    const pagesRef = []


    const togglePanel = (label) => {
        STSlidePanels[label] = !STSlidePanels[label]
    }

    const openFile = () => {
        inputRef.current.click()
    }

    const uploadFile = (e) => {
        const file = e.target.files[0]

        if (file) {
            if (file.type !== 'application/pdf') return Alert.show({
                icon: { name: 'alert-circle-o', color: '--red' },
                title: 'Only PDF files are accepted'
            })

            if (file.size > 29 * 1000 * 1000) return Alert.show({
                icon: { name: 'alert-circle-o', color: '--red' },
                title: 'File size exceeds the maximum limit (30 MB)'
            })

            STSpinner.isActive = true

            const formData = new FormData()
            formData.append('file', file, file.name)
            const fileName = file.name.replace(/\.[^/.]+$/, "")

            fetch(`${process.env.REACT_APP_FUNC_URL}?code=${process.env.REACT_APP_FUNC_CODE}&fileName=${fileName}&eventID=${STEvent.id}`, { method: 'post', body: formData })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        const headers = { 'Content-type': 'application/json' }
                        const body = JSON.stringify({ eventID: STEvent.id, slide: res.slide })

                        fetch(`${process.env.REACT_APP_API_URL}/slide/create`, { method: 'post', headers, body })
                            .then((res) => res.json())
                            .then((res) => {
                                STSpinner.isActive = false
                                STSlide.active.page = 1
                                STSlide.active.index = STSlides.list.length
                                STSlides.list.push(res.slide)
                            })
                    } else {
                        STSpinner.isActive = false
                    }
                })
        }
    }

    const changeSlide = (to) => {
        STSlide.active.page = 1
        if (to === STSlides.list.length) {
            STSlide.active.index = 0
        } else if (to === -1) {
            STSlide.active.index = STSlides.list.length - 1
        } else {
            STSlide.active.index = to
        }
    }

    const updateList = ({ source, destination }) => {
        if (!destination) return
        if (destination.index === source.index) return

        if (source.index === STSlide.active.index) STSlide.active.index = destination.index
        else if (((STSlide.active.index - source.index) * (STSlide.active.index - destination.index)) <= 0) {
            if (source.index > STSlide.active.index) STSlide.active.index = STSlide.active.index + 1
            else if (source.index < STSlide.active.index) STSlide.active.index = STSlide.active.index - 1
        }

        const [reorderedItem] = STSlides.list.splice(source.index, 1)
        STSlides.list.splice(destination.index, 0, reorderedItem)

        clearTimeout(reqTimeout)
        reqTimeout = setTimeout(() => window.ws.send(JSON.stringify({ command: 'SWAP_SLDS', eventID: STEvent.id, slides: STSlides.list })), 5000)
    }

    const changePage = (to) => {
        var toPage = 1
        if (to === '<') {
            toPage = STSlide.active.page === 1 ? STTheatre.show ? 1 : pageCount : STSlide.active.page - 1
        } else if (to === '>') {
            if (STSlide.active.page === pageCount && STTheatre.show) { return toggleTheatre('off') }
            else toPage = STSlide.active.page === pageCount ? 1 : STSlide.active.page + 1
        }
        STSlide.active.page = toPage
        pagesRef[toPage - 1].scrollIntoView()
        if (STTheatre.show) sendSlideUpdate(true, true)
    }

    const playSlide = () => {
        window.open(`${process.env.REACT_APP_HOST_URL}/event?id=${STEvent.id}`, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=no')
    }

    const deleteSlide = () => {
        const headers = { 'Content-type': 'application/json' }
        const body = JSON.stringify({ eventID: STEvent.id, slide: STSlides.list[STSlide.active.index] })

        fetch(`${process.env.REACT_APP_API_URL}/slide/delete`, { method: 'delete', headers, body })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    const deleteIndex = STSlide.active.index
                    STSlide.active.page = 1
                    if (STSlides.list.length !== 1 && STSlide.active.index === STSlides.list.length - 1) {
                        STSlide.active.index = STSlide.active.index - 1
                    }
                    STSlides.list.splice(deleteIndex, 1)
                }
            })
    }

    const toggleTheatre = (mode) => {
        if (mode === 'on') {
            STTheatre.show = !STTheatre.show
            STSlide.active.page = 1
            sendSlideUpdate(true)
        } else if (mode === 'off') {
            STTheatre.show = false
            sendSlideUpdate(false)
        }
    }

    const previewTheatre = () => {
        STTheatre.show = true
        sendSlideUpdate(true)
    }

    const sendSlideUpdate = (isStarted, pageUpdate = false) => {
        window.ws.send(JSON.stringify({ command: 'UPDT_SLDS', eventID: STEvent.id, isStarted, pageUpdate, activeSlide: isStarted ? STSlide.active : {} }))
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && STSlides.list.length) changePage('<')
            if ((e.key === 'ArrowRight' || e.key === 'PageDown') && STSlides.list.length) changePage('>')
            if (e.key === 'ArrowUp' && !STTheatre.show) changeSlide(STSlide.active.index - 1)
            if (e.key === 'ArrowDown' && !STTheatre.show) changeSlide(STSlide.active.index + 1)
            if (e.key === 'F5') toggleTheatre('on')
            if (e.key === 'Escape') STTheatre.show ? toggleTheatre('off') : STUI.name = ''
        }

        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [STSlide.active, STTheatre.show])


    return (
        <>
            <div className={sty.slides}>
                {SSSlides.list.length === 0
                    ? SSSpinner.isActive
                        ? <Spinner />
                        : <button className={sty.slideUploadBtn} onClick={() => openFile()}>
                            <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
                            <Icon name='add' size={30} color='--tint' />
                        </button>
                    : <>
                        {SSSlidePanels.files && <div className={sty.slidesPanel} style={{ marginRight: 10 }}>
                            <div className={sty.slidesPanelHead}>
                                <h1>Files</h1>
                                <div className={sty.slidesPanelBtns}>
                                    <button onClick={() => openFile()}>
                                        <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
                                        <Icon name='add' size={20} color='--tint' />
                                    </button>
                                </div>
                            </div>
                            <DragDropContext onDragEnd={updateList}>
                                <Droppable droppableId='slidesFiles'>
                                    {(provided) => (
                                        <div className={sty.slidesFiles} {...provided.droppableProps} ref={provided.innerRef}>
                                            {SSSlides.list.map((slide, index) => {
                                                return (
                                                    <Draggable draggableId={slide.id} index={index} key={slide.id}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={sty.slidePreview}
                                                                style={{ ...provided.draggableProps.style, border: index === SSSlide.active.index ? '5px solid var(--gray-2)' : 'none' }}
                                                                onClick={() => changeSlide(index)}>
                                                                <img className={sty.slidePreviewImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[index].name}/1.webp`} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}

                                            {provided.placeholder}

                                            {SSSpinner.isActive && <Spinner style={{ marginTop: -15, transform: 'scale(.7)' }} />}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>}

                        <div className={sty.slidesMain}>
                            <div className={sty.slidesHeader}>
                                <button className={sty.slideControlsBtn} onClick={() => togglePanel('files')}>
                                    <Icon name={SSSlidePanels.files ? 'folder' : 'folder-o'} size={24} color='--tint' />
                                    <div className='tooltip tooltipBottom'>Files</div>
                                </button>
                                <div className={sty.slidesHeaderMiddle}>
                                    <button className={sty.slideControlsBtn} onClick={() => playSlide()}>
                                        <Icon name='play-circle-o' size={28} color='--tint' />
                                        <div className='tooltip tooltipBottom'>Play</div>
                                    </button>
                                    <button className={sty.slideControlsBtn} onClick={() => deleteSlide()}>
                                        <Icon name='trash-o' size={24} color='--red' />
                                        <div className='tooltip tooltipBottom'>Remove</div>
                                    </button>
                                </div>
                                <button className={sty.slideControlsBtn} onClick={() => togglePanel('display')}>
                                    <Icon name={SSSlidePanels.display ? 'tv' : 'tv-o'} size={26} color='--tint' />
                                    <div className='tooltip tooltipBottom'>Display</div>
                                </button>
                            </div>
                            <div className={sty.activeSlide}>
                                <img className={sty.activeSlideBgImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} alt={`Page ${SSSlide.active.page}`} />

                                <img className={sty.activePageImg} onClick={() => previewTheatre()} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} alt={`Page ${SSSlide.active.page}`} />

                                <div className={sty.slideControls}>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('<')}>
                                        <Icon name='chevron-back' size={25} color='--tint' />
                                    </button>
                                    <h3 className={sty.slideControlsLbl}>{`${SSSlide.active.page} / ${pageCount}`}</h3>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('>')}>
                                        <Icon name='chevron-forward' size={25} color='--tint' />
                                    </button>
                                </div>
                            </div>
                            <div className={sty.slidePages}>
                                {Array(pageCount).fill().map((page, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={sty.slidePage}
                                            style={{
                                                backgroundColor: (index + 1) === SSSlide.active.page ? 'var(--gray-2)' : 'var(--fill-3)',
                                                margin: index === 0 ? '10px 5px 10px 10px' : index === pageCount - 1 ? '10px 10px 10px 5px' : '10px 5px'
                                            }}
                                            ref={(ref) => pagesRef[index] = ref}
                                            onClick={() => { STSlide.active.page = (index + 1) }}>
                                            <h5 className={sty.slidePageNumber}>{index + 1}</h5><img className={sty.slidePageImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${index + 1}.webp`} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {SSSlidePanels.display && <div className={sty.slidesPanel} style={{ marginLeft: 10 }}>
                            <div className={sty.slidesPanelHead}>
                                <h1>Displays</h1>
                                <div className={sty.slidesPanelBtns}>
                                    <button onClick={() => togglePanel('display')}>
                                        <Icon name='add' size={20} color='--tint' />
                                    </button>
                                </div>
                            </div>
                            <div className={sty.slidesDisplay}>

                            </div>
                        </div>}
                    </>
                }

            </div>

            {SSTheatre.show &&
                <div className={sty.theatrePresenter}>
                    <img className={sty.theatrePresenterImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} />
                    <button className={sty.theatrePresenterBtn} style={{ left: 0, display: SSSlide.active.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
                    <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
                </div>
            }
        </>
    )
}