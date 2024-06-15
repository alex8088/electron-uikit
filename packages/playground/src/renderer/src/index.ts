import { Menu, MenuItem } from '@electron-uikit/contextmenu/renderer'

function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    const theme = document.getElementById('theme')
    const icon = document.getElementById('icon')
    theme?.addEventListener('click', () => {
      window.uikit.ipcRenderer
        .invoke('dark-mode:toggle')
        .then((dark: boolean) => {
          if (dark) {
            icon?.classList.replace('icon-sun', 'icon-moon')
          } else {
            icon?.classList.replace('icon-moon', 'icon-sun')
          }
        })
    })

    const body = document.getElementById('app')
    body?.addEventListener('contextmenu', (e) => {
      e.preventDefault()

      const menu = new Menu()
      menu.append(
        new MenuItem({
          label: 'Menu Item One',
          click: (): void => {
            console.log('menu item one')
          }
        })
      )
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(
        new MenuItem({
          type: 'checkbox',
          label: 'Menu Item Two',
          checked: true,
          click: (): void => {
            console.log('menu item two')
          }
        })
      )
      menu.popup()
    })
  })
}

init()
