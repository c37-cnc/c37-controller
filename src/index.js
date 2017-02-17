// https://github.com/electron/electron/tree/master/docs-translations/pt-BR
var electron = require('electron'),
    app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//let win
var win;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {

    // Create the browser window.
    // https://github.com/electron/electron/blob/master/docs-translations/pt-BR/api/browser-window.md
    win = new BrowserWindow({
        // width: 1700,
        width: 1000,
        height: 611,
        // height: 1000,
        frame: false,
        toolbar: false,
        transparent: true,
        // http://stackoverflow.com/questions/31529772/how-to-set-app-icon-for-electron-atom-shell-app
        icon: __dirname + `/img/logo.png`,
        // http://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html
        //nodeIntegration: false,
        sandbox: false
    })

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`)

    // http://stackoverflow.com/questions/35019166/how-to-get-dom-tree-from-browserwindow-in-electron-app
    win.webContents.on('dom-ready', function () {
        win.webContents.executeJavaScript(
            "document.getElementById('button-window-close').addEventListener('click', function (event) { require('electron').ipcRenderer.send('window-state', 'close'); });" +
            "document.getElementById('button-window-minimize').addEventListener('click', function (event) { require('electron').ipcRenderer.send('window-state', 'minimize'); });" +
            "document.getElementById('button-window-maximize').addEventListener('click', function (event) { require('electron').ipcRenderer.send('window-state', 'maximize'); });"
        );
    });

    ipcMain.on('window-state', function (_, state) {

        if (state === "close") {
            win.close();
        } else if (state === "minimize") {
            win.minimize();
        } else {
            if (win.isMaximized()) {
                win.restore();
            } else {
                win.maximize();
            }
        }

    })

    // Open the DevTools. Ctrl + Shift + I
    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })



});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});