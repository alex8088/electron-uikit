import { core } from './common'
import { NOTIFICATION_CHANNEL } from './constants'

import type { NotificationInfo } from './types'

interface NotificationIcon {
  /**
   * An icon to use in the notification.
   */
  icon?: string
}

export const notification = {
  show: (info: Omit<NotificationInfo, 'icon'> & NotificationIcon): void => {
    core.ipcRenderer.send(NOTIFICATION_CHANNEL, info)
  },
  destroy: (): void => {
    core.ipcRenderer.send(NOTIFICATION_CHANNEL)
  }
}
