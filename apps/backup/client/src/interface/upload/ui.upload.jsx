import { useState, useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { Alert, Icon, Spinner } from '../../components/core.cmp'
import { STSpinner, STEvent, STSlide, STSlides } from '../../stores/app.store'

import sty from '../../styles/modules/desktop.module.css'


export const UI = () => {
  const [isUploaded, setIsUploaded] = useState(false)

  const SSSpinner = useSnapshot(STSpinner)
  const SSEvent = useSnapshot(STEvent)
  const inputRef = useRef()

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
                setIsUploaded(true)
                STSpinner.isActive = false
              })
          } else {
            STSpinner.isActive = false
          }
        })
    }
  }

  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams
    if (!STEvent.id && params.get('id')) STEvent.id = params.get('id')
  }, [])

  return (
    <div className={sty.slides}>
      {!SSEvent.id
        ? <h1>Event not found</h1>
        : SSSpinner.isActive
          ? <Spinner />
          : <div className={sty.uploadContext}>
            {isUploaded && <>
              <h1 className={sty.uploadTtl}>Uploaded successfully</h1>
              <h3 className={sty.uploadSbtl}>You can upload another one</h3>
            </>}

            <button className={sty.slideUploadBtn} onClick={() => openFile()}>
              <input type='file' accept='.pdf' style={{ display: 'none' }} ref={inputRef} onChange={(e) => uploadFile(e)} />
              <Icon name='add' size={30} color='--tint' />
            </button>
          </div>
      }
    </div>
  )
}