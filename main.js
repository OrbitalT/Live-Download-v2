const electron = require('electron');
const url = require('url');
const path = require('path');
var cmd = require('node-cmd');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// ready
app.on('ready', function(){
  // Create new main window
      mainWindow = new BrowserWindow(
          {
              webPreferences: {
                  nodeIntegration: true
              }
          }
      );
  //Load html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol:'file',
    slashes: true
  }));
  //quit app full
  mainWindow.on('closed', function(){
    app.quit();
  });

  //adds temp
  const mainMenu = Menu.buildFromTemplate(mainWindowTemplate);

  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('item:mp3', function(e, item){
  cmd.run('youtube-dl -f bestaudio --extract-audio --audio-format mp3 --audio-quality 0 -o "./Downloads/%(title)s.%(ext)s" ' + item);
});

ipcMain.on('item:mp4', function(e, item){
  cmd.run('youtube-dl -f best -o "./MP4/%(title)s.%(ext)s" ' + item);
});

ipcMain.on('item:channel', function(e, item){
  cmd.run('youtube-dl --config-location youtube-conf-channels.conf ' + item);
});

//menu temp
const mainWindowTemplate = [
  {
    label:'File',
    submenu:[
      {
        label:'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

//mac support
if(process.platform == "darwin"){
  mainMenuTemp.unshift({});
}

//dev tool
if(process.env.NODE_ENV !== 'production'){
  mainWindowTemplate.push({
    label: "Dev Tools",
    submenu:[
      {
        label: 'Toggle Devtools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
