/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_PRELOAD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
