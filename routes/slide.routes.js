const router = require('express').Router()
const { BlobServiceClient } = require('@azure/storage-blob')

const { db } = require('../api')
const { sendRoom } = require('../wss')
const { genRandom } = require('../utils/core.utils')

require('dotenv/config')

module.exports = router



router.post('/create', async (req, res) => {
  const { eventID, slide } = req.body

  const newSlide = { id: genRandom(6, 10), name: slide.name, pageCount: slide.pageCount }
  await db.events.updateAsync({ eventID }, { $push: { slides: newSlide } })
  const event = await db.events.findOneAsync({ eventID })

  sendRoom(eventID, 'user', { command: 'UPDT_SLDS', slides: event.slides })
  res.json({ success: true, message: 'Slide uploaded', slide: newSlide })
})



router.delete('/delete', async (req, res) => {
  const { eventID, slide } = req.body

  const blobService = await BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECT)
  const pdfsContainer = await blobService.getContainerClient(`event/${eventID}/pdfs`)
  const imgsContainer = await blobService.getContainerClient(`event/${eventID}/imgs`)

  const pdfBlob = pdfsContainer.getBlockBlobClient(`${slide.name}.pdf`)
  pdfBlob.delete()

  for (let i = 1; i <= slide.pageCount; i++) {
    const imgBlob = imgsContainer.getBlockBlobClient(`${slide.name}/${i}.webp`)
    imgBlob.delete()
  }

  const event = await db.events.findOneAsync({ eventID })
  event.slides = event.slides.filter((s) => s.name !== slide.name)
  await db.events.updateAsync({ eventID }, { $set: { slides: event.slides } })

  sendRoom(eventID, 'user', { command: 'UPDT_SLDS', slides: event.slides })
  res.json({ success: true, message: 'Slide deleted' })
})