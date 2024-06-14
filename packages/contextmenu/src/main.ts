import { ipcMain, IpcMainEvent, Menu, MenuItem, BrowserWindow } from 'electron'
import { CONTEXT_MENU_CHANNEL, CONTEXT_MENU_CLOSE_CHANNEL } from './constants'

import type { SerializableContextMenuItem, PopupOptions } from './types'

/**
 * Register the context menu IPC listener for use by the renderer.
 */
export function registerContextMenuListener(): void {
  if (ipcMain.eventNames().some((ename) => ename === CONTEXT_MENU_CHANNEL)) {
    return
  }

  ipcMain.on(
    CONTEXT_MENU_CHANNEL,
    (
      e,
      contextMenuId: number,
      items: SerializableContextMenuItem[],
      onClickChannel: string,
      options?: PopupOptions
    ) => {
      const menu = createMenu(e, onClickChannel, items)

      menu.popup({
        window: BrowserWindow.fromWebContents(e.sender) || undefined,
        x: options ? options.x : undefined,
        y: options ? options.y : undefined,
        positioningItem: options ? options.positioningItem : undefined,
        callback: () => {
          if (menu) {
            e.sender.send(CONTEXT_MENU_CLOSE_CHANNEL, contextMenuId)
          }
        }
      })
    }
  )
}

function createMenu(
  event: IpcMainEvent,
  onClickChannel: string,
  items: SerializableContextMenuItem[]
): Menu {
  const menu = new Menu()

  items.forEach((item) => {
    let menuItem: MenuItem

    // Separator
    if (item.type === 'separator') {
      menuItem = new MenuItem({
        type: item.type
      })
    }

    // Sub Menu
    else if (Array.isArray(item.submenu)) {
      menuItem = new MenuItem({
        submenu: createMenu(event, onClickChannel, item.submenu),
        label: item.label
      })
    }

    // Normal Menu Item
    else {
      menuItem = new MenuItem({
        label: item.label,
        type: item.type,
        accelerator: item.accelerator,
        checked: item.checked,
        enabled: item.enabled,
        visible: item.visible,
        click: (_menuItem, _win, contextmenuEvent): void =>
          event.sender.send(onClickChannel, item.id, contextmenuEvent)
      })
    }

    menu.append(menuItem)
  })

  return menu
}
