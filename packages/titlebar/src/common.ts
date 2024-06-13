import type { UIKitAPI } from '@electron-uikit/core'

export const core = ((globalThis || window).uikit ||
  (globalThis || window).electron) as UIKitAPI
