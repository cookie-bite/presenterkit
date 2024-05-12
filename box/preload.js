const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
    onStatusUpdate: (cb) => ipcRenderer.on('onStatusUpdate', (e, data) => cb(data))
})