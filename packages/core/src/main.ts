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
  session.setPreloads([
    ...session.getPreloads(),
    fileURLToPath(
      new URL(
        options.esModule ? 'uikit-preload.mjs' : 'uikit-preload.cjs',
        import.meta.url
      )
    )
  ])
}
