# @electron-uikit/contextmenu

![titlebar version](https://img.shields.io/npm/v/@electron-uikit/contextmenu.svg?color=orange&label=version)

Context menu for Electron app. Inspired by VS Code.

You can use the `Menu` class to create context menu in Electron, but it can only be created in the main process. But usually the context menu is triggered in the renderer process, which leads to code logic fragmentation, difficulty in reading, and additional IPC is required to respond to context menu operation processing results. UIKit context menu aims to solve these problems and provide a better DX.

You can easily use the context menu in the renderer process and use the same way as Electron Menu.

## Usage

### Install

```sh
npm i @electron-uikit/core @electron-uikit/contextmenu
```

1. Exposes the UI Kit APIs for components. See [@electron-uikit/core](https://github.com/alex8088/electron-uikit/tree/main/packages/core) guide for more details.

   You can expose it in the specified preload script:

   ```js
   import { exposeUIKit } from '@electron-uikit/core/preload'

   exposeUIKit()
   ```

   Or, you can expose it globally in the main process for all renderer processes:

   ```js
   import { useUIKit } from '@electron-uikit/core/main'

   useUIKit()
   ```

> [!NOTE]
> If you are using [@electron-toolkit/preload](https://github.com/alex8088/electron-toolkit/tree/master/packages/preload) to expose Electron APIs, there is no need to use this module, because `core` is also an export of it.

2. Register a listener in the main process, so that you can use it in the renderer process.

   ```js
   import { app } from 'electron'
   import { registerContextMenuListener } from '@electron-uikit/contextmenu'

   app.whenReady().then(() => {
     // Register context menu IPC listeners
     registerContextMenuListener()

     // ...
   })
   ```

3. Use the context menu in the renderer process.

   ```js
   import { Menu, MenuItem } from '@electron-uikit/contextmenu/renderer'

   document.body.addEventListener('contextmenu', (e) => {
     e.preventDefault()

     const menu = new Menu()
     menu.append(
       new MenuItem({
         type: 'checkbox',
         label: 'Menu Item One',
         checked: true,
         click: (): void => {
           console.log('menu item one')
         }
       })
     )
     menu.append(new MenuItem({ type: 'separator' }))
     menu.append(
       new MenuItem({
         label: 'Menu Item Two',
         click: (): void => {
           console.log('menu item two')
         }
       })
     )
     menu.popup()
   })
   ```
