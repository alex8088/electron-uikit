import { Menu, MenuItem } from '@electron-uikit/contextmenu/renderer'
import { notification } from '@electron-uikit/notification/renderer'
import { toast } from '@electron-uikit/toast/renderer'

function init(): void {
  toast.config({
    supportMain: true,
    bottom: 80
  })
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
          label: 'Popup Notification',
          click: (): void => {
            notification.show({ body: 'Gorgeous', extraData: { type: 1 } })
          }
        })
      )
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(
        new MenuItem({
          label: 'Show Text Toast',
          click: (): void => {
            toast.text('I am toast', 4000)
          }
        })
      )
      menu.append(
        new MenuItem({
          label: 'Show Loading Toast',
          click: (): void => {
            const reply = toast.loading('Loading')
            setTimeout(() => reply.success('Done'), 3000000)
          }
        })
      )
      menu.append(
        new MenuItem({
          label: 'Show Loading Toast (Main Process)',
          click: (): void => {
            window.uikit.ipcRenderer.send('toast:loading')
          }
        })
      )
      menu.popup()
    })
  })
}

init()
