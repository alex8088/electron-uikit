/* eslint-disable @typescript-eslint/no-explicit-any */

import { NativeImage } from 'electron'

export type NotificationOptions = {
  /**
   * Default title for the notification. It can also be overridden by the
   * title option of the show method. Defaults to
   * [`app.name`](https://www.electronjs.org/zh/docs/latest/api/app#appname).
   */
  title?: string
  /**
   * Default icon for the notification, which can be an icon path, url protocol
   * or [Electron NativeImage](https://www.electronjs.org/zh/docs/latest/api/native-image) object.
   * It can also be overridden by the icon option of the show method.
   */
  icon?: string | NativeImage
  /**
   * Notification window is offset from the bottom and right side.
   *
   * @platform win32
   */
  offset?: number
  /**
   * Time in milliseconds before notification is closed and should be greater then `2000`.
   * Defaults to `5000`.
   *
   * @platform win32
   */
  duration?: number
  /**
   * Custom html page loaded by notification window. It should be an absolute path.
   *
   * @platform win32
   */
  customPage?: string
  /**
   * Custom notification window width. Only valid if `customPage` has a value.
   *
   * @platform win32
   */
  width?: number
  /**
   * Custom notification window height. Only valid if `customPage` has a value.
   *
   * @platform win32
   */
  height?: number
  /**
   * When set to `true`, it will open the devTool for debugging custom notification
   * window. You should not enable this in production.
   *
   * @platform win32
   */
  debug?: boolean
}

export interface NotificationInfo {
  /**
   * A title for the notification, which will be shown at the top of the notification
   * window when it is shown.
   */
  title?: string
  /**
   * The body text of the notification, which will be displayed below the title.
   */
  body?: string
  /**
   * An icon to use in the notification.
   */
  icon?: string | NativeImage
  /**
   * Extra data for click events
   */
  extraData?: any
}

export interface SerializableNotificationInfo {
  title: string
  body?: string
  icon?: string
  extraData?: any
  duration: number
  custom: boolean
}
