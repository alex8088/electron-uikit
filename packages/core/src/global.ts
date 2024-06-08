import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('uikit', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (need dts)
  window.uikit = electronAPI
}
