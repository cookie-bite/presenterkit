import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STUI, STSlide, STSlides, STPages, STTheatre, STEvent, STActiveDisplay } from '../../stores/app.store'

import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Slides = () => {
  const SSUI = useSnapshot(STUI)
  const SSSlide = useSnapshot(STSlide)
  const SSSlides = useSnapshot(STSlides)
  const SSPages = useSnapshot(STPages)
  const SSTheatre = useSnapshot(STTheatre)
  const SSEvent = useSnapshot(STEvent)
  const SSActiveDisplay = useSnapshot(STActiveDisplay)


  const downloadPdf = (file) => {
    window.open(`${process.env.REACT_APP_BLOB_URL}/event/${STEvent.id}/pdfs/${file}.pdf`, '_blank')
  }

  const playSlide = (slide, index) => {
    if (slide.name === STActiveDisplay.slide.name) return STTheatre.show = true
    if (STSlide.active.index !== index) STSlide.active.page = 1
    STSlide.active.index = index
    STPages.show = true
  }

  const toggleCloseBtn = () => {
    if (STTheatre.showClose) {
      STTheatre.showClose = false
    } else {
      STTheatre.showClose = true
      setTimeout(() => STTheatre.showClose = false, 3000)
    }
  }


  useEffect(() => {
    STTheatre.show && setTimeout(() => STTheatre.showClose = false, 3000)
  }, [STTheatre.show])


  return (
    <AnimatePresence mode='wait'>
      {SSUI.name === 'Slides' && <>
        <AnimatePresence>
          {SSTheatre.show && <div className={sty.theatre}
            // initial={{ y: '100%' }}
            // animate={{ y: 0 }}
            // exit={{ y: '100%' }}
            // transition={{ ease: 'easeInOut', duration: 0.3 }}
            style={{ backgroundImage: `url('${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSActiveDisplay.slide.name}/${SSActiveDisplay.slide.page}.webp')` }}
            onClick={() => toggleCloseBtn()}
          >
            {SSTheatre.showClose && <button className={sty.theatreCloseBtn} onClick={() => STTheatre.show = false}>
              <Icon name='close' size={20} color='--white' />
            </button>}
          </div>}
        </AnimatePresence>
        {!SSTheatre.show && <motion.div className={sty.modalView}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
        >
          <div className={sty.modal}>
            <div className={sty.modalHeader}>
              {SSPages.show
                ? <>
                  <div className={sty.modalLblView}>
                    <button className={sty.modalHeadBtn} onClick={() => STPages.show = false}>
                      <Icon name='chevron-back' size={20} color='--tint' />
                    </button>
                  </div>
                  {SSActiveDisplay.slide.name === SSSlides.list[SSSlide.active.index].name
                    ? <div className={sty.slideHeaderLive}>
                      <Icon name='radio-button-on' size={20} color='--red' />
                      <h3 className={sty.slidePageCount} style={{ marginLeft: 5 }}>Live</h3>
                    </div>
                    : <h3 className={sty.slidePageCount}>{`${SSSlides.list[SSSlide.active.index].pageCount} pages`}</h3>
                  }
                  <button className={sty.modalHeadBtn} onClick={() => downloadPdf(SSSlides.list[SSSlide.active.index].name)}>
                    <Icon name='arrow-down' size={20} color='--tint' />
                  </button>
                </>
                : <>
                  <div className={sty.modalLblView}>
                    {SSSlides.list.length !== 0 && <div className={sty.modalCountBg}>
                      <h1 className={sty.modalCount}>{SSSlides.list.length}</h1>
                    </div>}
                    <h3 className={sty.modalHeaderLbl}>Slides</h3>
                  </div>
                  <button className={sty.modalHeadBtn} onClick={() => STUI.name = ''}>
                    <Icon name='close' size={20} color='--white' />
                  </button>
                </>
              }
            </div>
            <AnimatePresence>
              {!SSPages.show && <>
                {SSSlides.list.length
                  ? <motion.div className={sty.slides}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                  >
                    {SSSlides.list.map((slide, index) => {
                      return (
                        <div className={sty.slideItem} key={index} onClick={() => playSlide(slide, index)}>
                          <img className={sty.slideItemImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${slide.name}/${SSActiveDisplay.slide.name === slide.name ? SSActiveDisplay.slide.page : 1}.webp`} />
                          {(SSActiveDisplay.id && SSActiveDisplay.slide.name === slide.name) && <div className={sty.slideItemLive}>
                            <Icon name='radio-button-on' size={20} color='--red' />
                          </div>}
                        </div>
                      )
                    })}
                  </motion.div>
                  : <div className={sty.modalEmpty}>
                    <h3 className={sty.modalEmptyTtl}>No Slides Shared</h3>
                    <h5 className={sty.modalEmptySbtl} onClick={() => STUI.name = ''}>Presenter could upload soon.</h5>
                  </div>
                }
              </>}
            </AnimatePresence>
            <AnimatePresence>
              {SSPages.show && <motion.div className={sty.slidePages}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
              >
                {Array(SSSlides.list[SSSlide.active.index].pageCount).fill().map((page, index) => {
                  return (
                    <div key={index} className={sty.slidePage} style={{ backgroundColor: SSActiveDisplay.slide.name === SSSlides.list[SSSlide.active.index].name && SSActiveDisplay.slide.page === index + 1 ? 'var(--tint)' : 'var(--fill-1)' }}>
                      <img className={sty.slidePageImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${SSSlides.list[SSSlide.active.index].name}/${index + 1}.webp`} />
                      <h5 className={sty.slidePageNumber}>{index + 1}</h5>
                    </div>
                  )
                })}
              </motion.div>}
            </AnimatePresence>
          </div>
        </motion.div>}
      </>}
    </AnimatePresence>
  )
}