const { app, dialog, BrowserWindow, Menu } = require('electron')
const { autoUpdater } = require('electron-updater')
const { start } = require('./api')
const http2 = require('http2')
const path = require('path')


const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'

autoUpdater.autoDownload = true
autoUpdater.forceDevUpdateConfig = true


const createWindow = () => {
    let win = new BrowserWindow({
        title: 'PresenterKit',
        width: 800,
        height: 600,
        show: false,
        backgroundColor: '#141622',
        // frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    let box = new BrowserWindow({
        title: 'PresenterKit',
        width: 250,
        height: 250,
        show: false,
        backgroundColor: '#141622',
        frame: false,
        resizable: false,
        webPreferences: {
            devTools: false,
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'box', 'preload.js')
        }
    })

    const template = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                ...(isDev ? [
                    { role: 'reload' },
                    { role: 'toggleDevTools' }
                ] : []),
                { type: 'separator' },
                { role: 'togglefullscreen' },
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => await require('electron').shell.openExternal('https://electronjs.org')
                }
            ]
        }
    ]


    const isOnline = () => new Promise((resolve) => {
        const client = http2.connect('https://www.google.com')
        client.on('connect', () => { resolve(true); client.destroy() })
        client.on('error', () => { resolve(false); client.destroy() })
    })

    const launch = () => {
        win.loadURL('http://localhost:3000').then(() => {
            if (isDev) win.webContents.openDevTools()
            else win.maximize()

            win.show()
        })
    }


    Menu.setApplicationMenu(Menu.buildFromTemplate(isMac ? template : []))
    start().then(async () => await isOnline() ? autoUpdater.checkForUpdates() : launch())


    autoUpdater.addListener('update-not-available', () => launch())

    autoUpdater.addListener('update-available', () => {
        box.loadFile('./box/update.html').then(() => {
            box.webContents.send('onStatusUpdate', 'Updating')
            box.show()
        })
    })

    autoUpdater.addListener('download-progress', (info) => {
        box.webContents.send('onStatusUpdate', `Downloading ${info.percent.toFixed()}%`)
    })

    autoUpdater.addListener('update-downloaded', () => {
        box.webContents.send('onStatusUpdate', 'Relaunching')
        autoUpdater.quitAndInstall()
    })

    autoUpdater.addListener('error', (info) => {
        box.webContents.send('onStatusUpdate', 'Error')
        dialog.showMessageBox(box, { message: 'Error', detail: JSON.stringify(info) })
    })


    win.on('close', () =>{ win.removeAllListeners(); win = null })
    box.on('close', () =>{ box.removeAllListeners(); box = null })
}


app.on('ready', () => createWindow())
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })