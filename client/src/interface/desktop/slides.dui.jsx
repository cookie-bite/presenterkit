import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STApp, STDesktop } from '../../stores/app.store'
import { Panel } from '../../components/panel.cmp'
import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Slides = () => {
    const appSnap = useSnapshot(STApp)


    const downloadPdf = (file) => {
        window.open(`http://${appSnap.host.ip}:5000/uploads/pdfs/${file}.pdf`, '_blank')
    }

    const playSlide = (index) => {
        if (appSnap.playSlide.index !== index) STApp.playSlide.page = 1
        STDesktop.controls.isActive = false
        STApp.playSlide.index = index
        STApp.showTheatre = true
    }

    const exitSlide = () => {
        if (appSnap.showTheatre) {
            STApp.showTheatre = false
        } else {
            STApp.uiName = ''
        }
    }

    const changePage = (to) => {
        if (appSnap.playSlide.index !== appSnap.activeSlide.index && appSnap.showTheatre) {
            const pageCount = appSnap.slides[appSnap.playSlide.index].pageCount
            var toPage = 1
            
            if (to === '<') {
                toPage = appSnap.playSlide.page === 1 ? 1 : appSnap.playSlide.page - 1
            } else if (to === '>') {
                if (appSnap.playSlide.page === pageCount) return STApp.showTheatre = false 
                else toPage = appSnap.playSlide.page + 1
            }
            STApp.playSlide.page = toPage
        }
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'ArrowLeft') changePage('<')
            if (e.key === 'ArrowRight') changePage('>')
            if (e.key === 'Escape') exitSlide()
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [appSnap.playSlide, appSnap.activeSlide])


    return (
        <>
            <Panel label={'Slides'} count={appSnap.slides.length}>
                {appSnap.slides.length
                    ? <div className={sty.theatre}>
                        {appSnap.slides.map((slide, index) => {
                            return (
                                <div className={sty.theatreItem} key={index} onClick={() => playSlide(index)}>
                                    <img className={sty.theatreItemImg} src={`http://${appSnap.host.ip}:5000/uploads/imgs/${slide.name}/${appSnap.activeSlide.index === index ? appSnap.activeSlide.page : 1}.png`} />
                                    <div className={sty.theatreItemBtns}>
                                        <button className={sty.theatreItemBtn} onClick={() => downloadPdf(slide.name)}>
                                            <Icon name='arrow-down' size={24} color='--system-blue' />
                                        </button>
                                        <button className={sty.theatreItemBtn} onClick={() => playSlide(index)}>
                                            <Icon name='tv-o' size={24} color='--system-green' />
                                        </button>
                                    </div>
                                    {appSnap.activeSlide.index === index && <div className={sty.theatreItemLive}>
                                        <Icon name='radio-button-on' size={20} color='--system-red' />
                                    </div>}
                                </div>
                            )
                        })}
                    </div>
                    : <div className={sty.panelEmpty}>
                        <h3 className={sty.panelEmptyTtl}>No Slides Shared</h3>
                        <h5 className={sty.panelEmptySbtl} onClick={() => closeModal()}>Presenter could upload soon.</h5>
                    </div>}
            </Panel>

            {appSnap.showTheatre &&
                <div className={sty.theatrePresenter}>
                    {appSnap.activeSlide.index === appSnap.playSlide.index
                        ? <div className={sty.theatrePresenterView}>
                            <img className={sty.theatrePresenterImg} src={`http://${appSnap.host.ip}:5000/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${appSnap.activeSlide.page}.png`} />
                            <div className={sty.theatreItemLive}>
                                <Icon name='radio-button-on' size={20} color='--system-red' />
                            </div>
                        </div>
                        : <>
                            <img className={sty.theatrePresenterImg} src={`http://${appSnap.host.ip}:5000/uploads/imgs/${appSnap.slides[appSnap.playSlide.index].name}/${appSnap.playSlide.page}.png`} />
                            <button className={sty.theatrePresenterBtn} style={{ left: 0, display: appSnap.playSlide.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
                            <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
                        </>
                    }
                </div>
            }
        </>

    )
}