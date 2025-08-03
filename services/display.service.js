const { collection } = require('../api')


exports.handleUpdateDisplay = async (req, sendRoom) => {
  const { eventID, displayID, slide } = req
  const event = await collection('events').findOne({ eventID })

  let newSlide = {}

  event.displays.filter((display) => {
    if (display.id === displayID) {
      if (slide.name) display.slide.name = slide.name
      if (slide.pageCount) display.slide.pageCount = slide.pageCount
      if (slide.page) display.slide.page = slide.page

      newSlide = display.slide
    }
  })

  await collection('events').updateOne(
    { eventID },
    { $set: { displays: event.displays } }
  )

  if (displayID === event.activeDisplay.id) {
    await collection('events').updateOne(
      { eventID },
      { $set: { activeDisplay: { id: displayID, slide: newSlide } } }
    )
  }

  sendRoom(eventID, 'user', { command: 'UPDT_DISP', displayID, slide: newSlide })
}

exports.handleShareDisplay = async (req, sendRoom) => {
  const { eventID, displayID, state, slide } = req
  const event = await collection('events').findOne({ eventID })

  await collection('events').updateOne(
    { eventID },
    {
      $set: {
        displays: event.displays,
        activeDisplay: state ? { id: displayID, slide } : { id: '', slide: {} }
      }
    }
  )

  sendRoom(eventID, 'user', { command: 'SHARE_DISP', displayID, state, slide })
}