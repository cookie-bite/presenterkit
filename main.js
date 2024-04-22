const { app, BrowserWindow } = require('electron')
const { start } = require('./api')


function createWindow() {
    const win = new BrowserWindow({
        title: 'PresenterKit',
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        // frame: false,
        // thickFrame: false,
        // fullscreen: true,
        // simpleFullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    start().then(() => win.loadURL('http://localhost:3000'))
}


app.on('ready', createWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })
app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() })