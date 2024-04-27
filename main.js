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
            // devTools: isDev,
            nodeIntegration: false,
            contextIsolation: true
        }
    })


    // Menu.setApplicationMenu(Menu.buildFromTemplate(isMac ? [{ label: app.name, submenu: [] }] : []))
    if (isMac) app.dock.setMenu(Menu.buildFromTemplate([{ label: app.name, submenu: [] }]))


    start().then(() => win.loadURL('http://localhost:3000').then(() => { win.maximize(); win.show() }))
}


app.on('ready', createWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })
app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() })