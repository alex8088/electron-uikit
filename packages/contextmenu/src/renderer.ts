import { core } from './common'
import { CONTEXT_MENU_CHANNEL, CONTEXT_MENU_CLOSE_CHANNEL } from './constants'
import type {
  ContextMenuItem,
  ContextMenuEvent,
  SerializableContextMenuItem,
  PopupOptions
} from './types'

export type { ContextMenuItem, ContextMenuEvent, PopupOptions } from './types'

let contextMenuIdPool = 0

/**
 * Pops up a context menu in the `BrowserWindow`.
 * @param items Menu items
 * @param options Popup options
 * @param onHide Called when menu is closed.
 */
export function popup(
  items: ContextMenuItem[],
  options?: PopupOptions,
  onHide?: () => void
): void {
  const processedItems: ContextMenuItem[] = []

  const contextMenuId = contextMenuIdPool++
  const onClickChannel = `uikit:onContextMenu${contextMenuId}`
  const onClickChannelHandler = (
    _event: unknown,
    itemId: number,
    context: ContextMenuEvent
  ): void => {
    const item = processedItems[itemId]
    item.click?.(context)
  }

  const removeListener = core.ipcRenderer.once(
    onClickChannel,
    onClickChannelHandler
  )
  core.ipcRenderer.once(
    CONTEXT_MENU_CLOSE_CHANNEL,
    (_event: unknown, closedContextMenuId: number) => {
      if (closedContextMenuId !== contextMenuId) {
        return
      }

      removeListener()

      onHide?.()
    }
  )

  core.ipcRenderer.send(
    CONTEXT_MENU_CHANNEL,
    contextMenuId,
    items.map((item) => createItem(item, processedItems)),
    onClickChannel,
    options
  )
}

function createItem(
  item: ContextMenuItem,
  processedItems: ContextMenuItem[]
): SerializableContextMenuItem {
  const serializableItem: SerializableContextMenuItem = {
    id: processedItems.length,
    label: item.label,
    type: item.type,
    accelerator: item.accelerator,
    checked: item.checked,
    enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
    visible: typeof item.visible === 'boolean' ? item.visible : true
  }

  processedItems.push(item)

  // Submenu
  if (Array.isArray(item.submenu)) {
    serializableItem.submenu = item.submenu.map((submenuItem) =>
      createItem(submenuItem, processedItems)
    )
  }

  return serializableItem
}

export type MenuItemOptions = ContextMenuItem

export class MenuItem {
  constructor(public options: MenuItemOptions) {}
}

export class Menu {
  items: ContextMenuItem[] = []

  /**
   * Appends the `menuItem` to the menu.
   */
  append(item: MenuItem): void {
    this.items.push(item.options)
  }

  /**
   * Pops up this menu as a context menu in the `BrowserWindow`.
   */
  popup(options?: PopupOptions, onHide?: () => void): void {
    popup(this.items, options, onHide)
  }
}
