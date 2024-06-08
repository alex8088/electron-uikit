import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * Expose UI kit in the specified preload script.
 */
export function exposeUIKit(): void {
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
}
