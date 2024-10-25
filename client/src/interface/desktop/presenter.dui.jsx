import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { STUI, STSlide, STSlides, STTheatre, STSpinner, STEvent, STSlidePanels, STDisplays, STDisplay, STDisplayList } from '../../stores/app.store'

import { Alert, Icon, Spinner } from '../../components/core.cmp'
import { RTDisplay } from '../../routes/routes'

import sty from '../../styles/modules/desktop.module.css'


var reqTimeout = null


export const Presenter = () => {
    const SSSlide = useSnapshot(STSlide)
    const SSDisplays = useSnapshot(STDisplays)
    const SSDisplayList = useSnapshot(STDisplayList)
    const SSSlides = useSnapshot(STSlides)
    const SSSlidePanels = useSnapshot(STSlidePanels)
    const SSSpinner = useSnapshot(STSpinner)
    const SSTheatre = useSnapshot(STTheatre)
    const SSEvent = useSnapshot(STEvent)

    const inputRef = useRef()
    const displayListRef = useRef()
    const pageCountActive = STSlides.list[STSlide.active.index]?.pageCount
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
                                STSlide.active.index = STSlides.list.length - 1
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
        reqTimeout = setTimeout(() => window.ws.send(JSON.stringify({ command: 'UPDT_SLDS', eventID: STEvent.id, slides: STSlides.list })), 5000)
    }

    const changePage = (to) => {
        var toPage = 1
        if (to === '<') {
            toPage = STSlide.active.page === 1 ? STTheatre.show ? 1 : pageCountActive : STSlide.active.page - 1
        } else if (to === '>') {
            if (STSlide.active.page === pageCountActive && STTheatre.show) { return toggleTheatre(false) }
            else toPage = STSlide.active.page === pageCountActive ? 1 : STSlide.active.page + 1
        }
        STSlide.active.page = toPage
        pagesRef[toPage - 1]?.scrollIntoView()
    }
    
    const changeDisplayPage = (to, display) => {
        const page = display.slide.page
        var toPage = 1

        if (to === '<' && page !== 1) { toPage = page - 1 }
        else if (to === '>' && page !== display.slide.pageCount) { toPage = page + 1 }

        if (STTheatre.show) updateDisplay({ displayID: display.id, page: toPage })
    }

    const createDisplay = (label, slide) => {
        RTDisplay.create(STEvent.id, label, slide).then((data) => {
            if (data.success) {
                STSlidePanels.display = true

                window.open(`${process.env.REACT_APP_APP_URL}/event?id=${STEvent.id}&d=${data.display.id}`, '_blank', 'location=yes,height=540,width=954,resizable=yes,scrollbars=yes,status=yes')
            }
        })
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

    const toggleTheatre = (state) => {
        STTheatre.show = state
    }

    const updateDisplay = ({ displayID, slideName = null, pageCount = null, page = 1 }) => {
        window.ws.send(JSON.stringify({ command: 'UPDT_DISP', eventID: STEvent.id, displayID, slide: { name: slideName, page, pageCount } }))
    }

    const toggleSlideShare = (state) => {
        window.ws.send(JSON.stringify({ command: 'TOGL_SLD', eventID: STEvent.id, state, activeSlide: state ? STSlide.active : {} }))
    }



    useEffect(() => {
        const handler = (e) => {
            if (!STDisplayList.show) return
            if (!displayListRef.current.contains(e.target)) STDisplayList.show = false
        }
        document.addEventListener('click', handler, true)
        return () => document.removeEventListener('click', handler)
    }, [STDisplayList.show])


    useEffect(() => {
        const onKeyUp = (e) => {
            if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && STSlides.list.length) changePage('<')
            if ((e.key === 'ArrowRight' || e.key === 'PageDown') && STSlides.list.length) changePage('>')
            if (e.key === 'ArrowUp' && !STTheatre.show) changeSlide(STSlide.active.index - 1)
            if (e.key === 'ArrowDown' && !STTheatre.show) changeSlide(STSlide.active.index + 1)
            if (e.key === 'F5') toggleTheatre(true)
            if (e.key === 'Escape') STTheatre.show ? toggleTheatre(false) : STUI.name = ''
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
                                    <button className={sty.slideControlsBtn} onClick={() => SSDisplays.list.length ? STDisplayList.show = !STDisplayList.show : createDisplay('Display 1', SSSlides.list[SSSlide.active.index])}>
                                        <Icon name='play-circle-o' size={28} color='--tint' />
                                        {SSDisplayList.show
                                            ? <div className={sty.displayList} ref={displayListRef}>
                                                {SSDisplays.list.map((display) => {
                                                    return (
                                                        <div className={sty.displayListItem} onClick={() => updateDisplay({displayID: display.id, slideName: SSSlides.list[SSSlide.active.index].name, pageCount: SSSlides.list[SSSlide.active.index].pageCount })} key={display.id}>
                                                            <div className={sty.displayListItemIcon}>
                                                                <img src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${display.slide.name}/${display.slide.page}.webp`} />
                                                            </div>
                                                            <h4>{display.label}</h4>
                                                        </div>
                                                    )
                                                })}
                                                <div className={sty.displayListItem}>
                                                    <div className={sty.displayListItemIcon}>
                                                        <Icon name='add' size={20} color='--tint' />
                                                    </div>
                                                    <h4>Add Display</h4>
                                                </div>
                                            </div>
                                            : <div className='tooltip tooltipBottom'>Play</div>
                                        }
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

                                <img className={sty.activePageImg} onClick={() => toggleTheatre(true)} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} alt={`Page ${SSSlide.active.page}`} />

                                <div className={sty.slideControls}>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('<')}>
                                        <Icon name='chevron-back' size={25} color='--tint' />
                                    </button>
                                    <h3 className={sty.slideControlsLbl}>{`${SSSlide.active.page} / ${pageCountActive}`}</h3>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('>')}>
                                        <Icon name='chevron-forward' size={25} color='--tint' />
                                    </button>
                                </div>
                            </div>
                            <div className={sty.slidePages}>
                                {Array(pageCountActive).fill().map((page, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={sty.slidePage}
                                            style={{
                                                backgroundColor: (index + 1) === SSSlide.active.page ? 'var(--gray-2)' : 'var(--fill-3)',
                                                margin: index === 0 ? '10px 5px 10px 10px' : index === pageCountActive - 1 ? '10px 10px 10px 5px' : '10px 5px'
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
                                {SSDisplays.list.map((display, index) => {
                                    return (
                                        <div key={display.id} className={sty.displayPreview}>
                                            <img className={sty.displayPreviewImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${display.slide.name}/1.webp`} />
                                        </div>
                                    )
                                })}
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