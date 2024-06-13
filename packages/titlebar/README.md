# @electron-uikit/titlebar

![titlebar version](https://img.shields.io/npm/v/@electron-uikit/titlebar.svg?color=orange&label=version)

Title bar web component for Electron.

The title bar web component is used to simulate the Windows title bar for better customization. It's very easy to use and get the same experience as a native title bar. Fully compatible with Windows, MacOS and Linux.

## Features

- Customization
- Fully compatible with Windows, MacOS and Linux.
- Support dark mode
- Based on Web component

## Usage

### Install

```sh
npm i @electron-uikit/core @electron-uikit/titlebar
```

### Get Started

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

2. Register a listener and attach a title bar to the window in the main process, so that you can use it in the renderer process.

   ```js
   import {
     registerTitleBarListener,
     attachTitleBarToWindow
   } from '@electron-uikit/titlebar'

   app.whenReady().then(() => {
     // Register title bar IPC listeners
     registerTitleBarListener()

     // Create a window without title bar
     const win = new BrowserWindow({ titleBarStyle: 'hidden' })

     // Attach a title bar to the window
     attachTitleBarToWindow(win)
   })
   ```

3. Use the title bar web component in window html page.

   ```html
   <head>
     <!-- Import the title bar web component module in html header or its entry file -->
     <script type="module">
       import '@electron-uikit/titlebar/renderer'
     </script>
   </head>

   <body>
     <!-- You can customize the title bar height using a class or style -->
     <title-bar windowtitle="Electron UIKit" style="height: 32px;"></title-bar>
   </body>
   ```

## Components

### Attributes

| Attribute           | Description                                                          | Type      | Default |
| ------------------- | -------------------------------------------------------------------- | --------- | ------- |
| `windowtitle`       | Window title                                                         | `string`  | -       |
| `overlay`           | Set window controls overlay                                          | `boolean` | false   |
| `nominimize`        | If specified, the title bar will not show the minimization control   | `boolean` | false   |
| `nomaximize`        | If specified, the title bar will not show the nomaximization control | `boolean` | false   |
| `noclose`           | If specified, the title bar will not show the `x` control            | `boolean` | false   |
| `supportfullscreen` | Support fullscreen window mode                                       | `boolean` | false   |

### CSS Properties

| Property                    | Description                   | Default                                               |
| --------------------------- | ----------------------------- | ----------------------------------------------------- |
| `--tb-theme-color`          | Theme color                   | light: `#ffffff`, dark: `#1f1f1f`                     |
| `--tb-title-text-color`     | Window title text color       | light: `#333333`, dark: `#cccccc`                     |
| `--tb-title-font-family`    | Window title text font family | -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI' |
| `--tb-control-symbol-color` | Window control symbol color   | light: `#585c65`, dark: `#cccccc`                     |
| `--tb-control-hover-color`  | Window control hover color    | light: `#e1e1e1`, dark: `#373737`                     |
| `--tb-control-height`       | Window control height         | `26px` (minimum height)                               |
| `--tb-control-width `       | Window control width          | `34px` (minimum width)                                |
| `--tb-control-margin `      | Window control margins        | `3px` (MacOS only)                                    |
| `--tb-control-radius `      | Window control radius         | `5px` (MacOS only)                                    |

## Customization

### Theme Color

The default theme CSS is customizable by overriding the components CSS variables:

```css
.titlebar {
  height: 32px;
  --tb-theme-color: #ffffff;
  --tb-title-text-color: #333333;
  --tb-control-symbol-color: #585c65;
  --tb-control-hover-color: #e1e1e1;
}
```

Support dark mode by overriding the component CSS variable with `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  .titlebar {
    --tb-theme-color: #1f1f1f;
    --tb-title-text-color: #cccccc;
    --tb-control-symbol-color: #cccccc;
    --tb-control-hover-color: #373737;
  }
}
```

### Window Controls

- `Overlay mode`

  The titlebar only has window control display and no drag region for application.

  ```html
  <title-bar overlay class="titlebar"></title-bar>
  ```

- `Control size and display`

  ```html
  <title-bar nomaximize style="--tb-control-height: 34px;"></title-bar>
  ```

- `Customization`

  It is very easy to customize a window control, just define the control icon CSS and bind event handlers to the control element.

  ```css
  /* CSS style: control icon */
  .icon {
    height: 13px;
    width: 13px;
    background-color: #333;
    mask-position: 50% 50%;
    mask-repeat: no-repeat;
    mask-size: 100%;
  }

  .icon-sun {
    mask-image: url(/sun.svg);
  }

  .icon-moon {
    mask-image: url(/moon.svg);
  }
  ```

  ```html
  <title-bar id="titlebar" windowtitle="Electron UIKit" class="titlebar">
    <!-- You can customize your window controls with "window__control" class  -->
    <div id="control" class="window__control">
      <i id="icon" class="icon icon-sun"></i>
    </div>
  </title-bar>
  ```

  ```js
  const control = document.getElementById('control')
  control?.addEventListener('click', () => {
    // ...
  })
  ```

> [!NOTE]
> Only elements with the `window__control` class in the title bar slot will be recognized as window controls. Other elements will not be displayed.

## Integrations

### VS Code IDE

Add a file `.vscode/settings.json` with the following configuration:

```json
{
  "html.customData": [
    "./node_modules/@electron-uikit/titlebar/custom-elements.json"
  ]
}
```

VS Code will load additional title bar HTML entities, so they would show up in auto-completion, hover information etc.

### TypeScript and TSX

If you are a TypeScript user, make sure to add a \*.d.ts declaration file to get type checks and intellisense:

```ts
/// <reference types="@electron-uikit/titlebar/renderer" />
```

For `.tsx` support, a React example:

```ts
import { HTMLTitleBarElementAttributes } from '@electron-uikit/titlebar/renderer'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Define an interface for the web component props
      'title-bar': Partial<HTMLTitleBarElementAttributes>
    }
  }
}
```
