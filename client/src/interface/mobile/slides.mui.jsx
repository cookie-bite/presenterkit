import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STUI, STSlide, STSlides, STPages, STTheatre } from '../../stores/app.store'

import { Icon } from '../../components/core.cmp'

import sty from '../../styles/modules/mobile.module.css'


export const Slides = () => {
    const SSUI = useSnapshot(STUI)
    const SSSlide = useSnapshot(STSlide)
    const SSSlides = useSnapshot(STSlides)
    const SSPages = useSnapshot(STPages)
    const SSTheatre = useSnapshot(STTheatre)


    const downloadPdf = (file) => {
        window.open(`https://presenterkitstorage.blob.core.windows.net/pdfs/${file}.pdf`, '_blank')
    }

    const playSlide = (index) => {
        if (index === STSlide.active.index) return STTheatre.show = true
        if (STSlide.play.index !== index) STSlide.play.page = 1
        STSlide.play.index = index
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
                    {SSTheatre.show && <motion.div className={sty.theatre}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        style={{ backgroundImage: `url(https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.active.index].name}/${SSSlide.active.page}.webp)` }}
                        onClick={() => toggleCloseBtn()}
                    >
                        {SSTheatre.showClose && <button className={sty.theatreCloseBtn} onClick={() => STTheatre.show = false}>
                            <Icon name='close' size={20} color='--white' />
                        </button>}
                    </motion.div>}
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
                                            <Icon name='chevron-back' size={20} color='--primary-tint' />
                                        </button>
                                    </div>
                                    {SSSlide.active.index === SSSlide.play.index
                                        ? <div className={sty.slideHeaderLive}>
                                            <Icon name='radio-button-on' size={20} color='--system-red' />
                                            <h3 className={sty.slidePageCount} style={{ marginLeft: 5 }}>Live</h3>
                                        </div>
                                        : <h3 className={sty.slidePageCount}>{`${SSSlides.list[SSSlide.play.index].pageCount} pages`}</h3>
                                    }
                                    <button className={sty.modalHeadBtn} onClick={() => downloadPdf(SSSlides.list[SSSlide.play.index].name)}>
                                        <Icon name='arrow-down' size={20} color='--primary-tint' />
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
                                                <div className={sty.slideItem} key={index} onClick={() => playSlide(index)}>
                                                    <img className={sty.slideItemImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${slide.name}/${SSSlide.active.index === index ? SSSlide.active.page : 1}.webp`} />
                                                    {SSSlide.active.index === index && <div className={sty.slideItemLive}>
                                                        <Icon name='radio-button-on' size={20} color='--system-red' />
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
                                {Array(SSSlides.list[SSSlide.play.index].pageCount).fill().map((page, index) => {
                                    return (
                                        <div key={index} className={sty.slidePage} onClick={() => { STSlide.active.page = (index + 1) }}
                                            style={{ backgroundColor: SSSlide.active.index === SSSlide.play.index && SSSlide.active.page === index + 1 ? 'var(--system-yellow)' : 'var(--primary-fill)' }}>
                                            <img className={sty.slidePageImg} src={`https://presenterkitstorage.blob.core.windows.net/imgs/${SSSlides.list[SSSlide.play.index].name}/${index + 1}.webp`} />
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