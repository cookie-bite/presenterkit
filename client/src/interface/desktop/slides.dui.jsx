import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STUI, STSlide, STSlides, STTheatre, STEvent } from '../../stores/app.store'
import { Icon, Panel } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Slides = () => {
    const SSUI = useSnapshot(STUI)
    const SSSlide = useSnapshot(STSlide)
    const SSSlides = useSnapshot(STSlides)
    const SSTheatre = useSnapshot(STTheatre)
    const SSEvent = useSnapshot(STEvent)


    const downloadPdf = (file) => {
        window.open(`${process.env.REACT_APP_BLOB_URL}/event/${STEvent.id}/pdfs/${file}.pdf`, '_blank')
    }

    const playSlide = (index) => {
        if (STSlide.play.index !== index) STSlide.play.page = 1
        STSlide.play.index = index
        STTheatre.show = true
    }

    const exitSlide = () => {
        if (STTheatre.show) {
            STTheatre.show = false
        } else {
            STUI.name = ''
        }
    }

    const changePage = (to) => {
        if (STSlide.play.index !== STSlide.active.index && STTheatre.show) {
            const pageCount = STSlides.list[STSlide.play.index].pageCount
            var toPage = 1
            
            if (to === '<') {
                toPage = STSlide.play.page === 1 ? 1 : STSlide.play.page - 1
            } else if (to === '>') {
                if (STSlide.play.page === pageCount) return STTheatre.show = false 
                else toPage = STSlide.play.page + 1
            }
            STSlide.play.page = toPage
        }
    }


    useEffect(() => {
        const onKeyUp = (e) => {
            if (e.key === 'ArrowLeft') changePage('<')
            if (e.key === 'ArrowRight') changePage('>')
            if (e.key === 'Escape' && STUI.name === 'Slides') exitSlide()
        }
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [STSlide.play, STSlide.active])


    return (
        <>
            <Panel show={SSUI.name === 'Slides'} label={'Slides'} count={SSSlides.list.length}>
                {SSSlides.list.length
                    ? <div className={sty.theatre}>
                        {SSSlides.list.map((slide, index) => {
                            return (
                                <div className={sty.theatreItem} key={index} onClick={() => playSlide(index)}>
                                    <img className={sty.theatreItemImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${slide.name}/${SSSlide.active.index === index ? SSSlide.active.page : 1}.webp`} />
                                    <div className={sty.theatreItemBtns}>
                                        <button className={sty.theatreItemBtn} onClick={() => downloadPdf(slide.name)}>
                                            <Icon name='arrow-down' size={24} color='--blue' />
                                        </button>
                                    </div>
                                    {SSSlide.active.index === index && <div className={sty.theatreItemLive}>
                                        <Icon name='radio-button-on' size={20} color='--red' />
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

            {SSUI.name === 'Slides' && SSTheatre.show &&
                <div className={sty.theatrePresenter}>
                    {SSSlide.active.index === SSSlide.play.index
                        ? <div className={sty.theatrePresenterView}>
                            <img className={sty.theatrePresenterImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} />
                            <div className={sty.theatreItemLive}>
                                <Icon name='radio-button-on' size={20} color='--red' />
                            </div>
                        </div>
                        : <>
                            <img className={sty.theatrePresenterImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.play.index].name}/${SSSlide.play.page}.webp`} />
                            <button className={sty.theatrePresenterBtn} style={{ left: 0, display: SSSlide.play.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
                            <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
                        </>
                    }
                </div>
            }
        </>

    )
}