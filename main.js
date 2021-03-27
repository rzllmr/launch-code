const {app, BrowserWindow, Menu} = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: 'images/icon.png'
  });

  const menuTemplate = [
    {
      label: 'Compile',
      accelerator: 'Ctrl+C',
      click() {
        win.webContents.send('compile');
      },
      enabled: false,
      id: 'compile'
    },
    {
      label: 'Reload',
      accelerator: 'Ctrl+R',
      click() {
        win.reload();
      }
    },
    {
      label: 'Devtool',
      accelerator: 'Ctrl+D',
      click() {
        win.webContents.toggleDevTools();
      }
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  win.loadFile('index.html');
  win.webContents.on('did-finish-load', () => {
    const compileButton = menu.getMenuItemById('compile');
    compileButton.enabled = true;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
