import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { STUI, STSlide, STSlides, STTheatre, STEvent, STActiveDisplay } from '../../stores/app.store'
import { Icon, Panel } from '../../components/core.cmp'

import sty from '../../styles/modules/desktop.module.css'


export const Slides = () => {
  const SSUI = useSnapshot(STUI)
  const SSSlide = useSnapshot(STSlide)
  const SSSlides = useSnapshot(STSlides)
  const SSTheatre = useSnapshot(STTheatre)
  const SSEvent = useSnapshot(STEvent)
  const SSActiveDisplay = useSnapshot(STActiveDisplay)


  const downloadPdf = (file) => {
    window.open(`${process.env.REACT_APP_BLOB_URL}/event/${STEvent.id}/pdfs/${file}.pdf`, '_blank')
  }

  const playSlide = (index) => {
    if (STSlide.active.index !== index) STSlide.active.page = 1
    STSlide.active.index = index
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
    if (STSlides.list[STSlide.active.index].name !== STActiveDisplay.slide.name && STTheatre.show) {
      const pageCount = STSlides.list[STSlide.active.index].pageCount
      var toPage = 1

      if (to === '<') {
        toPage = STSlide.active.page === 1 ? 1 : STSlide.active.page - 1
      } else if (to === '>') {
        if (STSlide.active.page === pageCount) return STTheatre.show = false
        else toPage = STSlide.active.page + 1
      }
      STSlide.active.page = toPage
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
  }, [STSlide.active])


  return (
    <>
      <Panel show={SSUI.name === 'Slides'} label={'Slides'} count={SSSlides.list.length}>
        {SSSlides.list.length
          ? <div className={sty.theatre}>
            {SSSlides.list.map((slide, index) => {
              return (
                <div className={sty.theatreItem} key={index} onClick={() => playSlide(index)}>
                  <img className={sty.theatreItemImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${slide.name}/${SSActiveDisplay.slide.name === slide.name ? SSActiveDisplay.slide.page : 1}.webp`} />
                  <div className={sty.theatreItemBtns}>
                    <button className={sty.theatreItemBtn} onClick={() => downloadPdf(slide.name)}>
                      <Icon name='arrow-down' size={24} color='--blue' />
                    </button>
                  </div>
                  {SSActiveDisplay.slide.name === slide.name && <div className={sty.theatreItemLive}>
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
          {SSActiveDisplay.slide.name === SSSlides.list[SSSlide.active.index].name
            ? <div className={sty.theatrePresenterView}>
              <img className={sty.theatrePresenterImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSActiveDisplay.slide.name}/${SSActiveDisplay.slide.page}.webp`} />
              <div className={sty.theatreItemLive}>
                <Icon name='radio-button-on' size={20} color='--red' />
              </div>
            </div>
            : <>
              <img className={sty.theatrePresenterImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp`} />
              <button className={sty.theatrePresenterBtn} style={{ left: 0, display: SSSlide.active.page === 1 ? 'none' : 'flex' }} onClick={() => changePage('<')}></button>
              <button className={sty.theatrePresenterBtn} style={{ right: 0 }} onClick={() => changePage('>')}></button>
            </>
          }
        </div>
      }
    </>

  )
}