const electron = require('electron');
const url = require('url');
const path = require('path');
const { BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const { app } = electron;
let contextData = []
let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow(
        {
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        }
    )
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './template/main.html'),
            protocol: "file:",
            slashes: true
        })
    )
    const mainMenu = Menu.buildFromTemplate(MainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
    function resetAll(){
        const product_length = contextData.length
        let max = 0
        contextData.map(element=>{
            console.log(parseFloat(element.product_price) * parseFloat(element.product_count))
            max += parseFloat(element.product_price) * parseFloat(element.product_count);
        })
        const info ={
            max,
            product_length
        }
        mainWindow.webContents.send('key:resetData', contextData)
        mainWindow.webContents.send('key:summa',info)

    }
    ipcMain.on('key:data', (err, data) => {
        data.id = contextData.length
        contextData.push(data)
        resetAll()
    })
    ipcMain.on('key:DeleteItem',(err,id)=>{
        contextData = contextData.filter(function(item) {
            return item.id !== id
        })
        
        resetAll()
    })
    ipcMain.on('key:EditItem',(err,items)=>{
        contextData = contextData.filter(function(item) {
            if(items.id === item.id){
                 console.log('beraber')
                 return item = items
            }
        })
        console.log(contextData)
        
        resetAll()
    })
})
const MainMenuTemplate = [
    {
        label: 'Əlavə et',
        accelerator: 'Ctrl + D'
    },
    {
        label: 'Çıxış',
        accelerator: 'Ctrl + D',
        role: "quit"
    }
    ,
    {
        label: "Restart",
        accelerator: process.platform === 'darwin' ? 'Command + R' : 'Ctrl + R',
        click() {
            app.relaunch()
            app.exit()
        }


    }
    ,
    {
        label: "Developer Tools",
        accelerator: process.platform === 'darwin' ? 'Command + X' : 'Ctrl + X',
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools()
        }
    }
]