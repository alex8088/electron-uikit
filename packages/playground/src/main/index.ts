import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'

import { useUIKit } from '@electron-uikit/core'
import {
  registerTitleBarListener,
  attachTitleBarToWindow
} from '@electron-uikit/titlebar'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    title: 'Electron UIKit',
    width: 720,
    height: 520,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      ...(import.meta.env.VITE_USE_PRELOAD === 'true'
        ? { preload: join(__dirname, '../preload/index.js') }
        : {}),
      sandbox: false
    }
  })

  attachTitleBarToWindow(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown') {
      if (input.code === 'F12') {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools()
        } else {
          mainWindow.webContents.openDevTools({ mode: 'undocked' })
        }
      }
    }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  if (import.meta.env.VITE_USE_PRELOAD !== 'true') {
    useUIKit()
  }

  registerTitleBarListener()

  createWindow()

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})