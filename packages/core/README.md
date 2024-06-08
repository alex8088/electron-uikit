# @electron-uikit/core

Electron UI kit core. Exposes the UI Kit APIs for communicating between main and renderer processes.

## Usage

### Install

```sh
npm i @electron-uikit/core
```

### Get Started

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
