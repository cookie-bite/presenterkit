import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STDesktop } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Presenter = ({ ws }) => {
    const appSnap = useSnapshot(STApp)

    const inputRef = useRef()
    const pageCount = appSnap.slides[appSnap.activeSlide.index]?.pageCount
    const pagesRef = []


    const openFile = () => {
        inputRef.current.click()
    }

    const uploadFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            const formData = new FormData()
            STDesktop.slideFile = file
            formData.append('file', file, file.name)

            fetch(`http://localhost:${appSnap.host.port2}/slide`, { method: 'post', body: formData })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        STApp.activeSlide.page = 1
                        STApp.activeSlide.index = appSnap.slides.length
                        STApp.slides.push(res.slide)
                    }
                })

        }
    }

    const changePage = (to) => {
        var toPage = 1
        if (to === '<') {
            toPage = appSnap.activeSlide.page === 1 ? appSnap.showTheatre ? 1 : pageCount : appSnap.activeSlide.page - 1
        } else if (to === '>') {
            if (appSnap.activeSlide.page === pageCount && appSnap.showTheatre) { return toggleTheatre('off') }
            else toPage = appSnap.activeSlide.page === pageCount ? 1 : appSnap.activeSlide.page + 1
        }
        STApp.activeSlide.page = toPage
        pagesRef[toPage - 1].scrollIntoView()
        if (appSnap.showTheatre) sendSlideUpdate(true, true)
    }

    const changeSlide = (to) => {
        STApp.activeSlide.page = 1
        if (to === appSnap.slides.length) {
            STApp.activeSlide.index = 0
        } else if (to === -1) {
            STApp.activeSlide.index = appSnap.slides.length - 1
        } else {
            STApp.activeSlide.index = to
        }
    }

    const deleteSlide = () => {
        fetch(`http://localhost:${appSnap.host.port2}/slide`, { method: 'delete', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({ name: appSnap.slides[appSnap.activeSlide.index].name }) })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    STApp.activeSlide.page = 1
                    STApp.slides.splice(appSnap.activeSlide.index, 1)
                    if (appSnap.activeSlide.index === appSnap.slides.length - 1) {
                        STApp.activeSlide.index = appSnap.activeSlide.index - 1
                    }
                }
            })
    }

    const toggleTheatre = (mode) => {
        if (mode === 'on') {
            STApp.showTheatre = !appSnap.showTheatre
            STApp.activeSlide.page = 1
            sendSlideUpdate(true)
        } else if (mode === 'off') {
            STApp.showTheatre = false
            sendSlideUpdate(false)
        }
    }

    const previewTheatre = () => {
        STApp.showTheatre = true
        sendSlideUpdate(true)
    }

    const sendSlideUpdate = (isStarted, pageUpdate = false) => {
        ws.send(JSON.stringify({ command: 'UPDT_SLDS', room: STApp.userRoom, isStarted, pageUpdate, activeSlide: isStarted ? STApp.activeSlide : {} }))
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'ArrowLeft' && appSnap.slides.length) changePage('<')
            if (e.key === 'ArrowRight' && appSnap.slides.length) changePage('>')
            if (e.key === 'ArrowUp' && !appSnap.showTheatre) changeSlide(appSnap.activeSlide.index - 1)
            if (e.key === 'ArrowDown' && !appSnap.showTheatre) changeSlide(appSnap.activeSlide.index + 1)
            if (e.key === 'Escape') appSnap.showTheatre ? toggleTheatre('off') : STApp.uiName = ''
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [appSnap.activeSlide, appSnap.showTheatre])


    return (
        <>
            <div className={sty.slides}>
                {appSnap.slides.length === 0
                    ? <button className={sty.slideUploadBtn} onClick={() => openFile()}>
                        <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
                        <Icon name='add' size={30} color='--primary-tint' />
                    </button>
                    : <>
                        <div className={sty.slidesLeft}>
                            {appSnap.slides.map((slide, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={sty.slidePreview}
                                        style={{ border: index === appSnap.activeSlide.index ? '5px solid var(--system-gray2)' : 'none' }}
                                        onClick={() => changeSlide(index)}>
                                        <img className={sty.slidePreviewImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[index].name}/1.png`} />
                                    </div>
                                )
                            })}
                            <button className={sty.slideUploadBtnSml} onClick={() => openFile()}>
                                <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
                                <Icon name='add' size={26} color='--primary-tint' />
                            </button>
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
                                <div className={sty.activeSlideBg} style={{ backgroundImage: `url(http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${appSnap.activeSlide.page}.png)` }}></div>
                                <div className={sty.activePage} onClick={() => previewTheatre()}>
                                    <img className={sty.activePageImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${appSnap.activeSlide.page}.png`} />
                                </div>
                                <div className={sty.slideControls}>
                                    <button className={sty.slideControlsBtn} onClick={() => changePage('<')}>
                                        <Icon name='chevron-back' size={25} color='--primary-tint' />
                                    </button>
                                    <h3 className={sty.slideControlsLbl}>{`${appSnap.activeSlide.page} / ${pageCount}`}</h3>
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
                                                backgroundColor: (index + 1) === appSnap.activeSlide.page ? 'var(--system-gray2)' : 'var(--tertiary-fill)',
                                                margin: index === 0 ? '10px 5px 10px 10px' : index === pageCount - 1 ? '10px 10px 10px 5px' : '10px 5px'
                                            }}
                                            ref={(ref) => pagesRef[index] = ref}
                                            onClick={() => { STApp.activeSlide.page = (index + 1) }}>
                                            <h5 className={sty.slidePageNumber}>{index + 1}</h5><img className={sty.slidePageImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${index + 1}.png`} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>}

            </div>

            {appSnap.showTheatre &&
                <div className={sty.theatrePresenter}>
                    <img className={sty.theatrePresenterImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${appSnap.activeSlide.page}.png`} />
                    <button className={sty.theatrePresenterBtn} style={{ left: 0, display: appSnap.activeSlide.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
                    <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
                </div>
            }
        </>
    )
}