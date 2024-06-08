/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import rm from 'rollup-plugin-rm'

export default defineConfig([
  {
    input: ['src/global.ts'],
    output: [
      {
        entryFileNames: 'uikit-preload.cjs',
        format: 'cjs',
        dir: 'dist'
      },
      {
        entryFileNames: 'uikit-preload.mjs',
        format: 'es',
        dir: 'dist'
      }
    ],
    external: ['electron'],
    plugins: [rm('dist', 'buildStart'), resolve(), commonjs()]
  },
  {
    input: ['src/main.ts', 'src/preload.ts'],
    output: [
      {
        entryFileNames: '[name].cjs',
        chunkFileNames: 'chunks/lib-[hash].cjs',
        format: 'cjs',
        dir: 'dist'
      },
      {
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/lib-[hash].mjs',
        format: 'es',
        dir: 'dist'
      }
    ],
    external: ['electron'],
    plugins: [
      resolve(),
      commonjs(),
      ts({
        compilerOptions: {
          rootDir: 'src',
          declaration: true,
          outDir: 'dist/types'
        }
      }),
      {
        name: 'import-meta-url',
        resolveImportMeta(property, { format }) {
          if (property === 'url' && format === 'cjs') {
            return `require("url").pathToFileURL(__filename).href`
          }
          return null
        }
      }
    ]
  },
  {
    input: ['dist/types/main.d.ts'],
    output: [{ file: './dist/main.d.ts', format: 'es' }],
    plugins: [dts({ respectExternal: true })],
    external: ['electron']
  },
  {
    input: ['dist/types/preload.d.ts'],
    output: [{ file: './dist/preload.d.ts', format: 'es' }],
    plugins: [dts(), rm('dist/types', 'buildEnd')]
  }
])
