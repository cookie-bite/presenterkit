import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STEvent, STUI } from '../../stores/app.store'

import QRCode from 'react-qr-code'
import sty from '../../styles/modules/desktop.module.css'


export const QRScreen = () => {
  const [ssid, setSsid] = useState('')
  const [pass, setPass] = useState('')

  const SSUI = useSnapshot(STUI)
  const SSEvent = useSnapshot(STEvent)


  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === 'Escape' && STUI.name === 'QRScreen') STUI.name = ''
    }
    window.addEventListener('keyup', onKeyUp)
    return () => window.removeEventListener('keyup', onKeyUp)
  }, [])


  return (
    <AnimatePresence>
      {SSUI.name === 'QRScreen' && <motion.div className={sty.pageView}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.3 }}
      >
        <div className={sty.qrView}>
          <div className={sty.qr}>
            <div className={sty.qrBg}>
              <QRCode value={`WIFI:T:WPA;S:${ssid};P:${pass};H:;;`} size={Math.round(window.innerWidth / 5)} bgColor={'#00000000'} fgColor={'#ffffff'} />
            </div>
            <h1 className={sty.qrLbl}>1. Connect Wi-Fi</h1>
            <div className={sty.qrForm}>
              <div className={sty.qrLbls}>
                <h3 className={sty.qrInputLbl}>Network Name:</h3>
                <h3 className={sty.qrInputLbl}>Password:</h3>
              </div>
              <div className={sty.qrInputs}>
                <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Network name' value={ssid} onChange={(e) => setSsid(e.target.value)} />
                <input className={sty.qrInput} type='text' autoComplete='off' placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} />
              </div>
            </div>
          </div>
          <div className={sty.qr}>
            <div className={sty.qrBg}>
              <QRCode value={`${process.env.REACT_APP_HOST_URL}/event?id=${SSEvent.id}`} size={Math.round(window.innerWidth / 5)} bgColor={'#00000000'} fgColor={'#ffffff'} />
            </div>
            <h1 className={sty.qrLbl} style={{ animationDelay: '1.5s' }}>2. Enter App</h1>
            <div className={sty.qrForm}>
              <div className={sty.qrLbls}>
                <h3 className={sty.qrInputLbl}>Url:</h3>
                <h3 className={sty.qrInputLbl}>Code:</h3>
              </div>
              <div className={sty.qrInputs}>
                <div className={sty.qrHost}>
                  <h3 className={sty.qrHostLbl}>{process.env.REACT_APP_HOST_URL.split('//')[1]}</h3>
                </div>
                <div className={sty.qrHost}>
                  <h3 className={sty.qrHostLbl}>{SSEvent.id}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}