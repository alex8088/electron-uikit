import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig(({ mode }) => {
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    ...(mode === 'preload' ? { preload: {} } : null),
    renderer: {}
  }
})
