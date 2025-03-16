import { fileURLToPath } from 'node:url'
import { session as _session } from 'electron'

export type {
  IpcRenderer,
  NodeProcess,
  WebFrame,
  ElectronAPI as UIKitAPI
} from '@electron-toolkit/preload'

type UIKitOptions = {
  /**
   * Attach ES module preload script, Default: false
   */
  esModule: boolean
}

/**
 * Use UI kit for the specified session.
 */
export function useUIKit(
  session = _session.defaultSession,
  options: UIKitOptions = { esModule: false }
): void {
  const electronVer = process.versions.electron
  const electronMajorVer = electronVer ? parseInt(electronVer.split('.')[0]) : 0

  const preloadPath = fileURLToPath(
    new URL(
      options.esModule ? 'uikit-preload.mjs' : 'uikit-preload.cjs',
      import.meta.url
    )
  )

  if (electronMajorVer >= 35) {
    session.registerPreloadScript({ type: 'frame', filePath: preloadPath })
  } else {
    session.setPreloads([...session.getPreloads(), preloadPath])
  }
}
