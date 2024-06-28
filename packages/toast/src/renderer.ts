import { core } from './common'
import { TOAST_CHANNEL } from './constants'

import type { ToastType, ToastLoadingFn } from './types'

export type { ToastLoadingFn } from './types'

const SHADOW_ROOT_CSS = `
:host {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--toast-bottom, 50px);
  z-index: var(--toast-z-index, 5001);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 0;
  overflow: visible;
  user-select: none;
  --toast-color: #48484e;
  --toast-text-color: #ffffffd1;
  --toast-font-size: 14px;
  --toast-font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI';
  --toast-icon-size: 20px;
  --toast-icon-margin: 0 8px 0 0;
  --toast-padding: 6px 14px;
  --toast-border-radius: 4px;
  --toast-max-width: 320px;
  --toast-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05);
}
@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}
@keyframes fadeOut {
  from {
      opacity: 1;
  }
  to {
      opacity: 0;
  }
}
@keyframes loading {
  0% {
      transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
      transform: rotate3d(0, 0, 1, 360deg);
  }
}
.fade-in {
  animation: fadeIn ease 0.3s forwards;
}
.fade-out {
  animation: fadeOut ease 0.3s forwards;
}
.icon-loading {
  animation: loading 1s infinite cubic-bezier(0, 0, 1, 1);
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='currentColor' stroke-width='4'%3E%3Cpath d='M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6'%3E%3C/path%3E%3C/svg%3E");
}
.icon-success {
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M116 569a28 28 0 0 1-3-37l21-26c9-11 25-14 36-6l180 120c9 6 26 6 35-2l476-386c10-8 27-8 37 2l11 11c11 11 10 27-1 37L397 793a41 41 0 0 1-58-2L116 569z'/%3E%3C/svg%3E");
}
.icon-failed {
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M223 854a55 55 0 0 1-39-94l572-572a55 55 0 1 1 78 78L263 838a55 55 0 0 1-40 16z'/%3E%3Cpath d='M795 854a55 55 0 0 1-39-16L184 266a55 55 0 1 1 79-78l571 572a55 55 0 0 1-39 94z'/%3E%3C/svg%3E");
}
.toast {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: var(--toast-padding);
  border-radius: var(--toast-border-radius);
  flex-wrap: nowrap;
  overflow: hidden;
  max-width: var(--toast-max-width);
  color: var(--toast-text-color);
  background-color: var(--toast-color);
  box-shadow: var(--toast-box-shadow);
}
.toast__icon {
  margin: var(--toast-icon-margin);
  height: var(--toast-icon-size);
  width: var(--toast-icon-size);
  font-size: var(--toast-icon-size);
  mask-position: 50% 50%;
  mask-repeat: no-repeat;
  mask-size: 100%;
  background-color: currentColor;
}
.toast__content {
  display: inline-block;
  line-height: 1.4;
  font-size: var(--toast-font-size);
  font-family: var(--toast-font-family);
  word-break: break-all;
  text-align: center;
}
`

export type ToastOptions = {
  /**
   * Container element of Toast. Default to `document.body`
   */
  container?: HTMLElement
  /**
   * Display duration in millisecond. If set to `0`, it will not turn off
   * automatically. Default to `2000`.
   */
  duration?: number
  /**
   * Custom CSS class name for toast.
   */
  customClass?: string
  /**
   * Toast position to the bottom. Default to `50`.
   */
  bottom?: number
  /**
   * The maximum width of toast. Default to `320`.
   */
  maxWidth?: number
  /**
   * Toast background color.
   */
  color?: string
  /**
   * Toast text color.
   */
  textColor?: string
  /**
   * Toast font size. Default to `14`.
   */
  fontSize?: number
  /**
   * Toast icon size. Default to `20`.
   */
  iconSize?: number
  /**
   * Support Electron main process. Default to `false`.
   */
  supportMain?: boolean
}

class Toast {
  private shadowHost: HTMLElement | null = null
  private shadowRoot: ShadowRoot | null = null
  private view: HTMLElement | null = null
  private timeout: unknown | null = null

  private container?: HTMLElement
  private duration = 2000
  private customClass?: string
  private customStyle: Record<string, string> = {}

  private h(text: string, type: ToastType = 'text'): HTMLElement {
    const view = document.createElement('div')

    const toast = document.createElement('div')
    toast.classList.add('toast')

    if (type !== 'text') {
      const icon = document.createElement('i')
      icon.classList.add('toast__icon')
      icon.classList.add(`icon-${type}`)
      toast.appendChild(icon)
    }

    const content = document.createElement('div')
    content.classList.add('toast__content')
    content.innerText = text

    toast.appendChild(content)

    view.appendChild(toast)

    return view
  }

  private show(text: string, type: ToastType, duration: number): void {
    if (this.shadowHost) {
      if (this.timeout) {
        clearTimeout(this.timeout as number)
      }
      this.shadowRoot!.removeChild(this.view!)

      this.view = this.h(text, type)

      this.shadowRoot!.appendChild(this.view)
    } else {
      this.shadowHost = document.createElement('div')
      if (this.customClass) {
        this.shadowHost.classList.add(this.customClass)
      }

      if (this.customStyle) {
        for (const [key, value] of Object.entries(this.customStyle)) {
          this.shadowHost.style.setProperty(key, value)
        }
      }

      this.shadowRoot = this.shadowHost.attachShadow({ mode: 'open' })

      const style = document.createElement('style')
      style.textContent = SHADOW_ROOT_CSS
      this.shadowRoot.appendChild(style)

      this.view = this.h(text, type)

      this.shadowRoot.appendChild(this.view)

      this.view.classList.add('fade-in')

      if (this.container) {
        this.container.appendChild(this.shadowHost)
      } else {
        document.body.appendChild(this.shadowHost)
      }
    }

    if (duration > 0) {
      this.timeout = setTimeout(() => {
        this.view!.classList.add('fade-out')
        this.view!.addEventListener('animationend', () => {
          this.shadowRoot!.removeChild(this.view!)
          this.shadowRoot = null
          this.shadowHost!.remove()
          this.shadowHost = null
          this.view = null
          this.timeout = null
        })
      }, duration)
    }
  }

  private close(): void {
    if (this.shadowHost) {
      if (this.timeout) {
        clearTimeout(this.timeout as number)
      }
      this.view!.classList.add('fade-out')
      this.view!.addEventListener('animationend', () => {
        this.shadowRoot!.removeChild(this.view!)
        this.shadowRoot = null
        this.shadowHost!.remove()
        this.shadowHost = null
        this.view = null
        this.timeout = null
      })
    }
  }

  /**
   * Configure toast defaults or customize toast.
   */
  config(options: ToastOptions): void {
    const {
      container,
      customClass,
      duration,
      bottom,
      maxWidth,
      color,
      textColor,
      fontSize,
      iconSize
    } = options

    this.container = container
    this.duration = duration || this.duration
    this.customClass = customClass

    if (bottom) {
      this.customStyle['--toast-bottom'] = `${bottom}px`
    }
    if (maxWidth) {
      this.customStyle['--toast-max-width'] = `${maxWidth}px`
    }
    if (color) {
      this.customStyle['--toast-color'] = color
    }
    if (textColor) {
      this.customStyle['--toast-text-color'] = textColor
    }
    if (fontSize) {
      this.customStyle['--toast-font-size'] = `${fontSize}px`
    }
    if (iconSize) {
      this.customStyle['--toast-icon-size'] = `${iconSize}px`
    }

    if (options.supportMain) {
      core.ipcRenderer.on(
        TOAST_CHANNEL,
        (
          _,
          action: 0 | 1,
          text: string,
          type: ToastType,
          duration?: number
        ) => {
          if (action === 1) {
            this.show(text, type, duration ?? this.duration)
          } else {
            this.close()
          }
        }
      )
    }
  }

  /**
   * Show text. The default duration is `2000` ms.
   */
  text(text: string, duration = this.duration): void {
    this.show(text, 'text', duration)
  }

  /**
   * Show loading. The default duration is 0, which means it is always displayed
   * and can be turned off by calling its return value function.
   *
   * @example
   *
   * ```
   * import { toast } from '@electron-uikit/toast/renderer'
   *
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
      success: (text, duration = this.duration) =>
        this.show(text, 'success', duration),
      fail: (text, duration = this.duration) =>
        this.show(text, 'failed', duration),
      dismiss: () => this.close()
    }
  }
}

export const toast = new Toast()
