import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { STApp } from '../../stores/app.store'
import { Icon } from '../../components/core.cmp'
import { isValidUrl } from '../../utilities/core.utils'

import sty from '../../styles/modules/admin.module.css'


export const Shares = ({ ws }) => {
    const appSnap = useSnapshot(STApp)

    const textareaRef = useRef()
    const urlsRef = useRef()

    const [body, setBody] = useState(STApp.shares[STApp.activeShare].body)
    const [urls, setUrls] = useState(STApp.shares[STApp.activeShare].urls)


    const UrlBtn = ({ url }) => {
        const isValid = isValidUrl(url.link)

        const openUrl = () => {
            if (isValid) window.open(url.link.match(/^https?:/) ? url.link : '//' + url.link, '_blank')
        }


        return (
            url.link && <div className={sty.previewBtn}
                style={{ opacity: isValid ? 1 : .4, cursor: isValid ? 'pointer' : 'default', border: `2px solid ${url.color}`, background: `linear-gradient(45deg, ${url.color}24, ${url.color}2B)` }}
                onClick={() => openUrl()}
            >
                <Icon name={url.name} size={20} color='--white' />
            </div>
        )
    }


    const typeBody = (e) => {
        if (e.target.value.length < 141) setBody(e.target.value)
    }

    const setUrl = (value, index) => {
        const socials = {
            'discord': '#5865F2',
            'facebook': '#3b5998',
            'github': '#171515',
            'linkedin': '#0072b1',
            'reddit': '#FF4500',
            'telegram': '#0088CC',
            'twitch': '#6441a5',
            'whatsapp': '#25D366',
            'youtube': '#FF0000',
            'instagram': '#D62976',
            'tiktok': '#EE1D52'
        }
        const social = { link: value, name: '', color: '' }

        Object.keys(socials).filter(s => { if (value.includes(s)) social.name = s })
        social.color = social.name ? socials[social.name] : '#0A84FF'
        social.name = social.name ? `logo-${social.name}` : 'link-o'

        let temp = urls
        temp[index] = social
        setUrls(temp)
    }

    const deleteUrl = (e, index) => {
        if (urls.length > 1 && !urls[index].link && e.code === 'Backspace') {
            let temp = urls
            temp.splice(index, 1)
            setUrls(temp)
            if (index !== 0) setTimeout(() => urlsRef[index - 1].focus(), 500)
        }
    }

    const addUrl = () => {
        STApp.shares[STApp.activeShare].urls.push({ link: '', icon: 'link-o', color: '#0A84FF' })
    }

    const addShare = () => {
        STApp.shares.push({ body: '', urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }], isShared: false })
        STApp.activeShare = STApp.shares.length - 1
    }

    const closeShare = (e, index) => {
        e.stopPropagation()
        if (appSnap.activeShare === appSnap.shares.length - 1) STApp.activeShare = appSnap.shares.length - 2
        STApp.shares.splice(index, 1)
        ws.send(JSON.stringify({ command: 'SHR_ACT', action: 'update', shares: STApp.shares }))
    }

    const saveShare = (type, state) => {
        STApp.shares[appSnap.activeShare][type] = state
        ws.send(JSON.stringify({ command: 'SHR_ACT', action: 'save', shares: STApp.shares }))
    }

    const sendShare = () => {
        STApp.shares[appSnap.activeShare].urls = STApp.shares[appSnap.activeShare].urls.filter(u => u.link)
        STApp.shares[appSnap.activeShare].isShared = true
        console.log(STApp.shares)
        ws.send(JSON.stringify({ command: 'SHR_ACT', action: 'send', shares: STApp.shares, activeShare: appSnap.activeShare }))
    }

    const switchShare = (index) => {
        STApp.activeShare = index
    }


    useEffect(() => {
        setBody(STApp.shares[STApp.activeShare].body)
        setUrls(STApp.shares[STApp.activeShare].urls)
    }, [STApp.activeShare])
    
    useEffect(() => {
        textareaRef.current.style.height = 'inherit'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }, [body])


    return (
        <div className={sty.pageBg}>
            <div className={sty.page}>
                <div className={sty.shareSaves}>
                    {appSnap.shares.map((share, index) => {
                        return (
                            <div className={sty.shareSave} key={index} style={{ backgroundColor: index === appSnap.activeShare ? 'var(--system-gray3)' : 'var(--system-gray5)' }} onClick={() => switchShare(index)}>
                                <h3 className={sty.shareSaveLbl} style={{ color: index === appSnap.activeShare ? 'var(--primary-label)' : 'var(--secondary-label)' }}>{share.body ? share.body : 'Empty'}</h3>
                                {appSnap.shares.length !== 1 && <button className={sty.shareCloseBtn} style={{ backgroundColor: index === appSnap.activeShare ? 'var(--system-gray3)' : 'var(--system-gray5)' }} onClick={(e) => closeShare(e, index)}>
                                    <Icon name='close' size={20} color='--system-red' />
                                </button>}
                            </div>
                        )
                    })}
                    <button className={sty.urlBtn} onClick={() => addShare()}>
                        <Icon name='add' size={20} color='--primary-tint' />
                    </button>
                </div>
                <div className={sty.share}>
                    <div className={sty.shareBody}>
                        <textarea className={sty.shareInput} value={body} rows={1} maxLength={140} type='text' name='text' autoComplete='off' placeholder='Body'
                            ref={textareaRef}
                            onChange={(e) => typeBody(e)}
                            onBlur={() => saveShare('body', body)}
                        />
                    </div>
                    <div className={sty.sharePreview}>
                        <div className={sty.sharePreviewView}>
                            <div className={sty.previewIc}>
                                <Icon name='notifications-o' size={24} color='--system-blue' />
                            </div>
                            <div className={sty.previewBody}>
                                <h2 className={sty.previewBodyLbl} style={{ color: body ? 'var(--primary-label)' : 'var(--tertiary-label)' }}>{body ? body : 'Body'}</h2>
                            </div>
                            <div className={sty.previewBtns}>
                                {appSnap.shares[appSnap.activeShare].urls.map((url, index) => {
                                    return <UrlBtn url={url} key={index} />
                                })}
                            </div>
                        </div>
                        <div className={sty.sharePreviewBtns}>
                            <button className={sty.sharePreviewBtn} onClick={() => sendShare()}>
                                <h3 className={sty.sharePreviewBtnLbl}>{appSnap.shares[appSnap.activeShare].isShared ? 'Update' : 'Send'}</h3>
                            </button>
                        </div>
                    </div>
                    <div className={sty.shareUrls}>
                        {appSnap.shares[appSnap.activeShare].urls.map((url, index) => {
                            return (
                                <input className={sty.shareInput} style={{ marginBottom: 15, color: 'var(--system-blue)' }} key={index} value={url.link} type='text' name='text' autoComplete='off' placeholder='Url'
                                    ref={(ref) => urlsRef[index] = ref}
                                    autoFocus={true}
                                    onChange={(e) => setUrl(e.target.value, index)}
                                    onKeyDown={(e) => deleteUrl(e, index)}
                                    onBlur={() => saveShare('urls', urls)}
                                />
                            )
                        })}
                        {appSnap.shares[appSnap.activeShare].urls.at(-1).link && appSnap.shares[appSnap.activeShare].urls.length < 3 && <button className={sty.urlBtn} onClick={() => addUrl()}>
                            <Icon name='add' size={20} color='--white' />
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}