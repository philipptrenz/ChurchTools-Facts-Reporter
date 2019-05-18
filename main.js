// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const keytar = require('keytar')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const keytarServiceName = app.getName()

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 850,
    height: 550,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  // send app-close event to renderer
  mainWindow.on('close', function(e) {

    if (mainWindow !== null) {
      e.preventDefault()
      mainWindow.webContents.send('app-close')
    }
  });

  // Close window event from renderer
  ipcMain.on('app-closed', function() {
    mainWindow = null
    app.quit()
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
  //if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


// keytar

ipcMain.on('get-password', (event, user) => {
  keytar.getPassword(keytarServiceName, user)
      .then((res) => {
        event.returnValue = res;
      });
});

ipcMain.on('set-password', (event, user, pass) => {
  keytar.setPassword(keytarServiceName, user, pass)
      .then((res) => {
        event.returnValue = res;
      });
});

ipcMain.on('delete-password', (event, user) => {
  keytar.deletePassword(keytarServiceName, user)
      .then((res) => {
        event.returnValue = res;
      });
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
