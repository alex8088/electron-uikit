function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    const pin = document.getElementById('pin')
    const icon = document.getElementById('icon')
    pin?.addEventListener('click', () => {
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
  })
}

init()
