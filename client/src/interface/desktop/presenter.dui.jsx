import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { STHost, STUI, STSlide, STSlides, STTheatre, STSpinner, STEvent } from '../../stores/app.store'

import { Icon, Spinner } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Presenter = ({ ws, core }) => {
    const SSSlide = useSnapshot(STSlide)
    const SSSlides = useSnapshot(STSlides)
    const SSSpinner = useSnapshot(STSpinner)
    const SSTheatre = useSnapshot(STTheatre)

    const inputRef = useRef()
    const pageCount = STSlides.list[STSlide.active.index]?.pageCount
    const pagesRef = []


    const openFile = () => {
        inputRef.current.click()
    }

    const uploadFile = (e) => {
        const file = e.target.files[0]

        if (file) {
            STSpinner.isActive = true

            const formData = new FormData()
            formData.append('file', file, file.name)
            const fileName = file.name.replace(/\.[^/.]+$/, "")

            fetch(`https://pk-pdf2img.azurewebsites.net/api/Convert?fileName=${fileName}&code=HdqQb5u0JVhYERwSGsn9xz2ddp57ctX8Z97AAneukmAzAzFuyCdeCQ==`, { method: 'post', body: formData })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        const headers = { 'Content-type': 'application/json' }
                        const body = JSON.stringify({ eventID: STEvent.id, slide: res.slide })

                        fetch(`http://localhost:${STHost.port2}/slide`, { method: 'post', headers, body })
                            .then((res) => res.json())
                            .then((res) => {
                                STSpinner.isActive = false
                                STSlide.active.page = 1
                                STSlide.active.index = STSlides.list.length
                                STSlides.list.push(res.slide)
                            })
                    }
                })
        }
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

    const deleteSlide = () => {
        const headers = { 'Content-type': 'application/json' }
        const body = JSON.stringify({ eventID: STEvent.id, slide: STSlides.list[STSlide.active.index] })

        fetch(`http://localhost:${STHost.port2}/slide`, { method: 'delete', headers, body })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    const index = STSlide.active.index
                    STSlide.active.page = 1
                    if (STSlides.list.length !== 1 && STSlide.active.index === STSlides.list.length - 1) {
                        STSlide.active.index = STSlide.active.index - 1
                    }
                    STSlides.list.splice(index, 1)
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
        ws.send(JSON.stringify({ command: 'UPDT_SLDS', eventID: STEvent.id, isStarted, pageUpdate, activeSlide: isStarted ? STSlide.active : {} }))
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
                            <Icon name='add' size={30} color='--primary-tint' />
                        </button>
                    : <>
                        <div className={sty.slidesLeft}>
                            {SSSlides.list.map((slide, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={sty.slidePreview}
                                        style={{ border: index === SSSlide.active.index ? '5px solid var(--system-gray2)' : 'none' }}
                                        onClick={() => changeSlide(index)}>
                                        <img className={sty.slidePreviewImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[index].name}/1.webp`} />
                                    </div>
                                )
                            })}
                            {SSSpinner.isActive
                                ? <Spinner style={{ marginTop: -15, transform: 'scale(.7)' }} />
                                : <button className={sty.slideUploadBtnSml} onClick={() => openFile()}>
                                    <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
                                    <Icon name='add' size={26} color='--primary-tint' />
                                </button>
                            }
                        </div>
                        <div className={sty.slidesRight}>
                            <div className={sty.slidesHeader}>
                                <div className={sty.slidesHeaderMiddle}>
                                    <button className={sty.slideControlsBtn} onClick={() => toggleTheatre('on')}>
                                        <Icon name='tv-o' size={25} color='--primary-tint' />
                                        <div className='tooltip tooltipBottom'>Play</div>
                                    </button>
                                    <button className={sty.slideControlsBtn} onClick={() => deleteSlide()}>
                                        <Icon name='trash-o' size={25} color='--system-red' />
                                        <div className='tooltip tooltipBottom'>Remove</div>
                                    </button>
                                </div>
                            </div>
                            <div className={sty.activeSlide}>
                                <div className={sty.activeSlideBg} style={{ backgroundImage: `url(https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp)` }}></div>
                                <div className={sty.activePage} onClick={() => previewTheatre()}>
                                    <img className={sty.activePageImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} />
                                </div>
                                <div className={sty.slideControls}>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('<')}>
                                        <Icon name='chevron-back' size={25} color='--primary-tint' />
                                    </button>
                                    <h3 className={sty.slideControlsLbl}>{`${SSSlide.active.page} / ${pageCount}`}</h3>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('>')}>
                                        <Icon name='chevron-forward' size={25} color='--primary-tint' />
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
                                                backgroundColor: (index + 1) === SSSlide.active.page ? 'var(--system-gray2)' : 'var(--tertiary-fill)',
                                                margin: index === 0 ? '10px 5px 10px 10px' : index === pageCount - 1 ? '10px 10px 10px 5px' : '10px 5px'
                                            }}
                                            ref={(ref) => pagesRef[index] = ref}
                                            onClick={() => { STSlide.active.page = (index + 1) }}>
                                            <h5 className={sty.slidePageNumber}>{index + 1}</h5><img className={sty.slidePageImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.active.index].name}/${index + 1}.webp`} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                }

            </div>

            {SSTheatre.show &&
                <div className={sty.theatrePresenter}>
                    <img className={sty.theatrePresenterImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} />
                    <button className={sty.theatrePresenterBtn} style={{ left: 0, display: SSSlide.active.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
                    <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
                </div>
            }
        </>
    )
}