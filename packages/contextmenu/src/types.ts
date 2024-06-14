export interface CommonContextMenuItem {
  /**
   * A `string` indicating the item's visible label.
   */
  label?: string
  /**
   * A `string` indicating the type of the item. Can be `normal`, `separator`,
   * `submenu`, `checkbox` or `radio`.
   */
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio'
  /**
   * An `Accelerator` (optional) indicating the item's accelerator, if set.
   */
  accelerator?: string
  /**
   * A `boolean` indicating whether the item is enabled.
   */
  enabled?: boolean
  /**
   * A `boolean` indicating whether the item is visible.
   */
  visible?: boolean
  /**
   * A `boolean` indicating whether the item is checked.
   *
   * A `checkbox` menu item will toggle the `checked` property on and off when
   * selected.
   *
   * A `radio` menu item will turn on its `checked` property when clicked, and will
   * turn off that property for all adjacent items in the same menu.
   *
   * You can add a `click` function for additional behavior.
   */
  checked?: boolean
}

export interface SerializableContextMenuItem extends CommonContextMenuItem {
  id: number
  submenu?: SerializableContextMenuItem[]
}

export interface ContextMenuItem extends CommonContextMenuItem {
  /**
   * A `Function` that is fired when the MenuItem receives a click event.
   */
  click?: (event: ContextMenuEvent) => void
  /**
   * A `Menu` (optional) containing the menu item's submenu, if present.
   */
  submenu?: ContextMenuItem[]
}

export interface ContextMenuEvent {
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

export interface PopupOptions {
  /**
   * Default is the current mouse cursor position. Must be declared if `y` is
   * declared.
   */
  x?: number
  /**
   * Default is the current mouse cursor position. Must be declared if `x` is
   * declared.
   */
  y?: number
  /**
   * The index of the menu item to be positioned under the mouse cursor at the
   * specified coordinates. Default is -1.
   *
   * @platform darwin
   */
  positioningItem?: number
}
