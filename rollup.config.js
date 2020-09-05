import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import license from 'rollup-plugin-license'
import { name, version, author, license as LICENSE } from './package.json';

// Config
const libName = "phixi"
const libNamespace = "phixi"
const noDeclarationFiles = { compilerOptions: { declaration: false } }
const externals = Object.keys(require('./package.json').peerDependencies) || []
const licenseBanner = `/*!
 * ${ name } ${version}
 * ${LICENSE} Licensed
 *
 * Copyright (C) ${author}
 */`

export default [
  // commonJS
  {
    input: './src/index.ts',
    output: {
      file: `lib/${libName}.js`,
      format: 'cjs',
    },
    external: externals,
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      license({banner: licenseBanner})
    ],
  },

  // esm
  {
    input: './src/index.ts',
    output: {
      file: `lib/${libName}.esm.js`,
      format: 'esm',
    },
    external: externals,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      license({banner: licenseBanner})
    ],
  },

  // UMD Dev
  {
    input: 'src/index.ts',
    output: {
      file: `dist/${libName}.js`,
      format: 'umd',
      name: `${libNamespace}`,
      globals: {
        'phina.js': 'phina',
        'pixi.js': 'PIXI'
      },
    },
    external: externals,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      license({banner: licenseBanner})
    ]
  },

  // UMD Prod
  {
    input: 'src/index.ts',
    output: {
      file: `dist/${libName}.min.js`,
      format: 'umd',
      name: `${libNamespace}`,
      globals: {
        'phina.js': 'phina',
        'pixi.js': 'PIXI'
      },
    },
    external: externals,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      license({banner: licenseBanner})
    ]
  }
]
