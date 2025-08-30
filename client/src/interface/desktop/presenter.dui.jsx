import { useEffect, useRef, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Countdown from 'react-countdown'
import { useSnapshot } from 'valtio'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { STUI, STSlide, STSlides, STTheatre, STSpinner, STEvent, STSlidePanels, STDisplays, STDisplayList, STActiveDisplay, STDisplay } from '../../stores/app.store'

import { Alert, Icon, Spinner } from '../../components/core.cmp'
import { RTDisplay } from '../../routes/routes'

import sty from '../../styles/modules/desktop.module.css'


var reqTimeout = null


export const Presenter = () => {
  const SSSlide = useSnapshot(STSlide)
  const SSSlides = useSnapshot(STSlides)
  const SSSlidePanels = useSnapshot(STSlidePanels)
  const SSDisplays = useSnapshot(STDisplays)
  const SSDisplayList = useSnapshot(STDisplayList)
  const SSSpinner = useSnapshot(STSpinner)
  const SSTheatre = useSnapshot(STTheatre)
  const SSEvent = useSnapshot(STEvent)
  const SSActiveDisplay = useSnapshot(STActiveDisplay)

  const [displayName, setDisplayName] = useState('')

  const [timeInput, setTimeInput] = useState('3:00')
  const [timeInMinutes, setTimeInMinutes] = useState(3)
  // const [showTimeInput, setShowTimeInput] = useState(true)
  const [inputError, setInputError] = useState('')

  const inputRef = useRef()
  const displayListRef = useRef()
  const pageCountActive = STSlides.list[STSlide.active.index]?.pageCount
  const pagesRef = useRef([])
  const countdownRef = useRef(null)


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
    let toPage = 1
    if (to === '<') {
      toPage = STSlide.active.page === 1 ? STTheatre.show ? 1 : pageCountActive : STSlide.active.page - 1
    } else if (to === '>') {
      if (STSlide.active.page === pageCountActive && STTheatre.show) { return toggleTheatre(false) }
      else toPage = STSlide.active.page === pageCountActive ? 1 : STSlide.active.page + 1
    }
    STSlide.active.page = toPage
    pagesRef.current[toPage - 1]?.scrollIntoView()
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

  const openDisplayForm = ({ newEmptyDisplay = false } = {}) => {
    STSlidePanels.display = true
    STSlidePanels.displayForm = true
    STSlidePanels.newEmptyDisplay = newEmptyDisplay
  }

  const closeDisplayForm = () => {
    STSlidePanels.displayForm = false
    STSlidePanels.newEmptyDisplay = false
    setDisplayName('')
  }

  const createDisplay = (label = 'New Display', slide) => {
    const newSlide = STSlidePanels.newEmptyDisplay ? null : slide

    RTDisplay.create(STEvent.id, label, newSlide).then((data) => {
      if (data.success) {
        STSlidePanels.display = true
        STSlidePanels.displayForm = false
        setDisplayName('')

        window.open(`${process.env.REACT_APP_APP_URL}/event?id=${STEvent.id}&d=${data.display.id}`, '_blank', 'location=yes,height=540,width=954,resizable=yes,scrollbars=yes,status=yes')
      }
    })
  }

  const changeDisplayPage = (to, display) => {
    const page = display.slide.page
    var toPage = 1

    if (to === '<' && page !== 1) {
      toPage = page - 1
      updateDisplay({ displayID: display.id, page: toPage })
    } else if (to === '>' && page !== display.slide.pageCount) {
      toPage = page + 1
      updateDisplay({ displayID: display.id, page: toPage })
    }
  }

  const updateDisplay = ({ displayID, slideName = null, pageCount = null, page = 1 }) => {
    window.ws.send(JSON.stringify({ command: 'UPDT_DISP', eventID: STEvent.id, displayID, slide: { name: slideName, page, pageCount } }))
  }

  const toggleShareLive = (display) => {
    window.ws.send(JSON.stringify({ command: 'SHARE_DISP', eventID: STEvent.id, displayID: display.id, state: display.id !== STActiveDisplay.id, slide: display.slide }))
  }

  const addTimer = (displayID) => {
    const newTimer = { action: 'ADD', duration: timeInMinutes }
    STDisplays.list.filter((display) => {
      if (display.id === displayID) {
        display.timer = newTimer
        display.timer.showInput = true
      }
    })
    window.ws.send(JSON.stringify({ command: 'UPDT_TIMER', eventID: STEvent.id, displayID, timer: newTimer }))
  }

  const removeTimer = (displayID) => {
    STDisplays.list.filter((display) => {
      if (display.id === displayID) {
        display.timer = null
      }
    })
    window.ws.send(JSON.stringify({ command: 'UPDT_TIMER', eventID: STEvent.id, displayID, timer: { action: 'REMOVE' } }))
  }

  const handleTimerInputChange = (e) => {
    setTimeInput(e.target.value)
    setInputError('')
  }

  const handleTimerInputBlur = () => {
    let input = timeInput.trim()
    let minutes = 0, seconds = 0

    // Acceptable formats: mm:ss, m:ss, mm, m, :ss, m:
    if (/^\d+$/.test(input)) {
      // Only minutes, e.g., '5' or '12'
      minutes = parseInt(input, 10)
    } else if (/^\d{1,2}:\d{1,2}$/.test(input)) {
      // mm:ss or m:ss
      const [minStr, secStr] = input.split(':')
      minutes = parseInt(minStr, 10)
      seconds = parseInt(secStr, 10)
    } else if (/^:\d{1,2}$/.test(input)) {
      // :ss (e.g., ':30' means 0:30)
      minutes = 0
      seconds = parseInt(input.slice(1), 10)
    } else if (/^\d{1,2}:$/.test(input)) {
      // m: or mm: (e.g., '5:' means 5:00)
      minutes = parseInt(input.slice(0, -1), 10)
      seconds = 0
    } else {
      setInputError('Invalid format. Use mm:ss, m:ss, mm, or :ss')
      return
    }

    // Validate ranges
    if (
      isNaN(minutes) || isNaN(seconds) ||
      minutes < 0 || seconds < 0 || seconds > 59 ||
      (minutes === 0 && seconds === 0)
    ) {
      setInputError('Please enter a valid time (e.g., 5, 3:00, 0:30)')
      return
    }

    // Convert to minutes (float) for your timer logic
    const totalMinutes = minutes + seconds / 60
    setTimeInMinutes(totalMinutes)
    setTimeInput(`${minutes}:${seconds.toString().padStart(2, '0')}`) // normalize display
    setInputError('')
  }

  const setShowTimeInput = (displayID, state) => {
    STDisplays.list.filter((display) => {
      if (display.id === displayID) {
        display.timer.showInput = state
      }
    })
  }

  const makeHandleTimerStart = (displayID) => () => {
    setShowTimeInput(displayID, false)
    window.ws.send(JSON.stringify({ command: 'UPDT_TIMER', eventID: STEvent.id, displayID, timer: { action: 'START' } }))
  }

  const makeHandleTimerPause = (displayID) => () => {
    setShowTimeInput(displayID, false)
    window.ws.send(JSON.stringify({ command: 'UPDT_TIMER', eventID: STEvent.id, displayID, timer: { action: 'PAUSE' } }))
  }

  const makeHandleTimerStop = (displayID) => () => {
    setShowTimeInput(displayID, true)
    window.ws.send(JSON.stringify({ command: 'UPDT_TIMER', eventID: STEvent.id, displayID, timer: { action: 'STOP' } }))
  }

  const makeHandleTimerComplete = (displayID) => () => {
    setShowTimeInput(displayID, true)
  }

  const closeDisplay = async (displayID) => {
    await RTDisplay.close(STEvent.id, displayID)
  }


  const CountdownRenderer = ({ minutes, seconds, completed, api }) => {
    return (
      <>
        <div className={sty.displayTimerBtns}>
          {api.isStarted() && !api.isPaused() ? (
            <button className={sty.displayTimerBtn} style={{ backgroundColor: 'var(--orange-bg)' }} onClick={() => api.pause()}>
              <Icon name='pause' size={20} color='--orange' />
            </button>
          ) : (
            <button className={sty.displayTimerBtn} style={{ backgroundColor: 'var(--green-bg)' }} onClick={() => api.start()}>
              <Icon name='play' size={20} color='--green' />
            </button>
          )}
          <button className={sty.displayTimerBtn} onClick={() => api.stop()}>
            <Icon name='close' size={20} color='--white' />
          </button>
        </div>
        {!api.isStopped() && <div className={sty.displayTimerCounter}>
          <h3 style={{ color: completed ? 'var(--red)' : 'var(--orange)' }}>{`${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`}</h3>
        </div>}
      </>
    )
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
      if (e.key === 'PageUp' && STActiveDisplay.id) changeDisplayPage('<', { id: STActiveDisplay.id, slide: STActiveDisplay.slide })
      if (e.key === 'PageDown' && STActiveDisplay.id) changeDisplayPage('>', { id: STActiveDisplay.id, slide: STActiveDisplay.slide })
      if (e.key === 'ArrowLeft' && STSlides.list.length && !STSlidePanels.displayForm) changePage('<')
      if (e.key === 'ArrowRight' && STSlides.list.length && !STSlidePanels.displayForm) changePage('>')
      if (e.key === 'ArrowUp' && !STTheatre.show) changeSlide(STSlide.active.index - 1)
      if (e.key === 'ArrowDown' && !STTheatre.show) changeSlide(STSlide.active.index + 1)
      if (e.key === 'F5') toggleTheatre(true)
      if (e.key === 'Escape') STTheatre.show ? toggleTheatre(false) : STUI.name = ''
    }

    window.addEventListener('keyup', onKeyUp)
    return () => window.removeEventListener('keyup', onKeyUp)
  }, [STActiveDisplay.id, STActiveDisplay.slide, STSlide.active.page, STSlide.active.index, STTheatre.show])

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
                            <div className={sty.displayListItem} onClick={() => updateDisplay({ displayID: display.id, slideName: SSSlides.list[SSSlide.active.index].name, pageCount: SSSlides.list[SSSlide.active.index].pageCount })} key={display.id}>
                              <div className={sty.displayListItemIcon}>
                                {display.slide && <img src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${display.slide.name}/${display.slide.page}.webp`} />}
                              </div>
                              <h4>{display.label}</h4>
                            </div>
                          )
                        })}
                        <div className={sty.displayListItem} onClick={() => openDisplayForm()}>
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
                {(() => { pagesRef.current = []; return null })()}
                {Array(pageCountActive).fill().map((page, index) => {
                  return (
                    <div
                      key={index}
                      className={sty.slidePage}
                      style={{
                        backgroundColor: (index + 1) === SSSlide.active.page ? 'var(--gray-2)' : 'var(--fill-3)',
                        margin: index === 0 ? '10px 5px 10px 10px' : index === pageCountActive - 1 ? '10px 10px 10px 5px' : '10px 5px'
                      }}
                      ref={el => { if (el) pagesRef.current[index] = el }}
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
                  <button onClick={() => openDisplayForm({ newEmptyDisplay: true })}>
                    <Icon name='add' size={20} color='--tint' />
                  </button>
                </div>
              </div>
              <div className={sty.slidesDisplay}>
                <AnimatePresence>
                  {SSSlidePanels.displayForm && <motion.div
                    className='fd-c'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                  >
                    <div className={sty.displayForm}>
                      <button className={sty.displayFormCloseBtn} onClick={() => closeDisplayForm()}>
                        <Icon name='close' size={16} color='--tint' />
                      </button>
                      <div className={sty.displayFormBody}>
                        <h3>Add {SSSlidePanels.newEmptyDisplay && 'Empty'} Display</h3>
                        <input className={sty.displayInput} type='text' autoComplete='off' autoFocus autoCapitalize='words' placeholder='Display name' value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.code === 'Enter') createDisplay(displayName, SSSlides.list[SSSlide.active.index]) }}
                        />
                        <button className={sty.displayInputBtn} onClick={() => createDisplay(displayName, SSSlides.list[SSSlide.active.index])}>Add</button>
                      </div>
                    </div>
                    <hr className={sty.displayFormLine} />
                  </motion.div>}
                </AnimatePresence>
                {SSDisplays.list.map((display) => {
                  return (
                    <div className={SSSlidePanels.activeDisplayID === display.id ? sty.displayBgActive : sty.displayBg} key={display.id}>
                      <h3 className={SSSlidePanels.activeDisplayID === display.id ? sty.displayLblActive : sty.displayLbl}>{display.label}</h3>
                      <div className={sty.displayPreview} onClick={() => STSlidePanels.activeDisplayID = SSSlidePanels.activeDisplayID === display.id ? '' : display.id}>
                        {display.slide
                          ? <img className={sty.displayPreviewImg} src={`${process.env.REACT_APP_BLOB_URL}/event/${SSEvent.id}/imgs/${display.slide.name}/${display.slide.page}.webp`} />
                          : <div className={sty.displayEmpty}>
                            <Icon name='tv' size={60} color='--fill-1' />
                          </div>
                        }
                      </div>
                      <AnimatePresence>
                        {SSSlidePanels.activeDisplayID === display.id && <motion.div
                          className={sty.displayMenu}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ ease: 'easeInOut', duration: 0.3 }}
                        >
                          {display.slide && <div className={sty.displayControls}>
                            <button className={sty.displayControlsBtn} onClick={() => changeDisplayPage('<', display)}>
                              <Icon name='chevron-back' size={20} color='--tint' />
                            </button>
                            <h3 className={sty.displayControlsLbl}>{`${display.slide.page} / ${display.slide.pageCount}`}</h3>
                            <button className={sty.displayControlsBtn} onClick={() => changeDisplayPage('>', display)}>
                              <Icon name='chevron-forward' size={20} color='--tint' />
                            </button>
                          </div>}
                          {display.timer && <div className={sty.displayTimer}>
                            <Countdown
                              ref={countdownRef}
                              date={Date.now() + timeInMinutes * 60 * 1000}
                              renderer={CountdownRenderer}
                              autoStart={false}
                              onStart={makeHandleTimerStart(display.id)}
                              onPause={makeHandleTimerPause(display.id)}
                              onStop={makeHandleTimerStop(display.id)}
                              onComplete={makeHandleTimerComplete(display.id)}
                            />
                            {display.timer.showInput}
                            {display.timer.showInput && <input
                              type='text'
                              name='duration'
                              placeholder='mm:ss'
                              value={timeInput}
                              onBlur={handleTimerInputBlur}
                              onChange={handleTimerInputChange}
                              className={sty.displayTimerInput}
                              style={{ color: inputError ? 'var(--red)' : 'var(--label-1)' }}
                            />}
                          </div>}
                          <div className={sty.displayOptions}>
                            {display.slide && <button className={sty.displayOption} onClick={() => toggleShareLive(display)}>
                              <h4 className={sty.displayOptionLbl} style={{ color: display.id === SSActiveDisplay.id ? 'var(--green)' : 'inherit' }}>Share Live</h4>
                            </button>}
                            {display.timer ? (
                              <button className={sty.displayOption} onClick={() => removeTimer(display.id)}>
                                <h4 className={sty.displayOptionLbl}>Remove timer</h4>
                              </button>
                            ) : (
                              <button className={sty.displayOption} onClick={() => addTimer(display.id)}>
                                <h4 className={sty.displayOptionLbl}>Add timer</h4>
                              </button>
                            )}
                            <button className={sty.displayOption} onClick={() => closeDisplay(display.id)}>
                              <h4 className={sty.displayOptionLbl} style={{ color: 'var(--red)' }}>Close</h4>
                            </button>
                          </div>
                        </motion.div>}
                      </AnimatePresence>
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