/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import rm from 'rollup-plugin-rm'

export default defineConfig([
  {
    input: ['src/main.ts'],
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
    external: ['electron', '@tiny-libs/typed-event-emitter'],
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
      rm('dist', 'buildStart'),
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
    input: ['src/preload.ts'],
    output: [
      {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/lib-[hash].js',
        format: 'cjs',
        dir: 'dist'
      }
    ],
    external: ['electron'],
    plugins: [
      resolve(),
      commonjs(),
      ts(),
      {
        name: 'copy-html',
        buildEnd: () => {
          fs.copyFile(
            path.resolve('src/index.html'),
            path.resolve('dist/index.html')
          )
          fs.copyFile(
            path.resolve('src/icon.svg'),
            path.resolve('dist/icon.svg')
          )
        }
      }
    ]
  },
  {
    input: ['src/renderer.ts'],
    output: [
      { file: './dist/renderer.mjs', format: 'es' },
      { name: 'renderer', file: './dist/renderer.js', format: 'iife' }
    ],
    external: ['electron'],
    plugins: [
      ts({
        compilerOptions: {
          rootDir: 'src',
          declaration: true,
          outDir: 'dist/types'
        }
      })
    ]
  },
  {
    input: ['dist/types/main.d.ts'],
    output: [{ file: './dist/main.d.ts', format: 'es' }],
    plugins: [dts()]
  },
  {
    input: ['dist/types/renderer.d.ts'],
    output: [{ file: './dist/renderer.d.ts', format: 'es' }],
    plugins: [dts(), rm('dist/types', 'buildEnd')]
  }
])
