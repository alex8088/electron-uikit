import { BrowserWindow } from 'electron'
import { TOAST_CHANNEL } from './constants'

import type { ToastType, ToastLoadingFn } from './types'

export type { ToastLoadingFn } from './types'

/**
 * Toast for Electron main process. Before use, you must ensure that
 * `toast.config({ supportMain: true }` is configured in the renderer.
 *
 * @example
 *
 * ```
 * import { BrowserWindow } from 'electron'
 * import { Toast } from '@electron-uikit/toast'
 *
 * const win = new BrowserWindow()
 *
 * const toast = new Toast(win)
 * toast.text('foo')
 * toast.loading('loading')
 * ```
 */
export class Toast {
  constructor(readonly win: BrowserWindow) {}

  private show(text: string, type: ToastType, duration?: number): void {
    this.win.webContents.send(TOAST_CHANNEL, 1, text, type, duration)
  }

  private close(): void {
    this.win.webContents.send(TOAST_CHANNEL, 0)
  }

  /**
   * Show text. The default duration is `2000` ms.
   */
  text(text: string, duration?: number): void {
    this.show(text, 'text', duration)
  }

  /**
   * Show loading. The default duration is 0, which means it is always displayed
   * and can be turned off by calling its return value function.
   *
   * @example
   *
   * ```
   * import { Toast } from '@electron-uikit/toast'
   *
   * const toast = new Toast(win)
   * const reply = toast.loading('Loading')
   *
   * setTimeout(() => {
   *   reply.success('Successful')
   * }, 3000)
   * ```
   */
  loading(text: string, duration = 0): ToastLoadingFn {
    this.show(text, 'loading', duration)
    return {
      success: (text, duration) => this.show(text, 'success', duration),
      fail: (text, duration) => this.show(text, 'failed', duration),
      dismiss: () => this.close()
    }
  }
}
