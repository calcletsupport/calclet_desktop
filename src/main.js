const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let window;
let currentFilePath;

function createWindow() {
  window = new BrowserWindow({
    backgroundColor: "#ffffff",
    height: 700,
    width: 1200,
    darkTheme: false,
    title: "Calclet",
    icon: path.join(__dirname, "assets", "ico", "notepad.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  window.loadFile(path.join(__dirname, "index.html"))

  window.on('closed', () => {
    window = null;
  });
}

const isMac = process.platform === 'darwin'

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: "New",
        click: () => {
          if(currentFilePath !== undefined) {
             saveFile();
         }
          window.webContents.send("create-new-file-message-from-main");
        },
      },
      {
        label: "Open",
            click: () => {
          getFileFromUser();
        },
      },
      {
        label: "Save",
            click: () =>
        {
          saveFile();
        },
      },
      {
        label: "Save As",
            click: () =>
        {
          saveAsFile();
        },
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'zoomIn' },
      { role: 'zoomOut' },
    ]
  },
  {
    label: 'Run',
    submenu: [
      {
        label: "Run",
        click: () => {
        window.webContents.send("run");
      }
    },
      { role: 'toggleDevTools' },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: "Documentation"
      }
    ]
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

ipcMain.on("reload", () => {
  window.webContents.reload();
});

ipcMain.on("close", () => {
  window.close();
});

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (isMac === false) {
    app.quit();
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
})

const getFileFromUser = () =>
{
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: "JavaScript Files", extensions: ["js"]},
    ]
  }).then(function (response) {
    if (!response.canceled) {
      let file = response.filePaths[0];
      currentFilePath = file.toString();
      console.log(currentFilePath);
      const content = fs.readFileSync(file).toString()
      console.log(content);
      window.webContents.send("file-opened", file, content)
    } else {
      console.log("no file selected");
    }
  });
}

const saveAsFile = () => {
    dialog.showSaveDialog({
      title: 'Select the File Path to save',
   //   defaultPath: path.join(__dirname, '../assets/sample.txt'),
      // defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: 'Save',
      // Restricting the user to only Text Files.
      filters: [
        {
          name: 'JavaScript File',
          extensions: ['js']
        }, ],
      properties: []
    }).then(file => {
      // Stating whether dialog operation was cancelled or not.
      console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath.toString());
        currentFilePath = file.filePath.toString();
      window.webContents.send('get-content-message-from-main');

      ipcMain.on("content-message-from-renderer", (event, args) => {
        console.log(args);
        fs.writeFile(file.filePath.toString(),
          args, function (err) {
            if (err) throw err;
          });
    });
    }
  }).catch(err => {
    console.log(err)
});
}

const saveFile = () => {

    if(currentFilePath === undefined) {
        saveAsFile();
    }

    window.webContents.send('get-content-message-from-main');

    ipcMain.on("content-message-from-renderer", (event, args) => {
        console.log(args);
        console.log(currentFilePath);
        fs.writeFile(currentFilePath,
        args, function (err) {
            if (err) throw err;
        });
});
}


ipcMain.on("reset-current-file-path-from-renderer", (event, args) => {
   currentFilePath = undefined;
});