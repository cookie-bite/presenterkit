const { app, BrowserWindow, Menu } = require('electron')
const { start } = require('./api')


const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'


const createWindow = () => {
    const win = new BrowserWindow({
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


    Menu.setApplicationMenu(Menu.buildFromTemplate(isMac ? template : []))

    start().then(() => win.loadURL('http://localhost:3000').then(() => { if (!isDev) win.maximize(); win.show() }))
}


app.on('ready', createWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })
app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() })