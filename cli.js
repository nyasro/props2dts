#!/usr/bin/env node

const react2dts = require('react-to-typescript-definitions')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const [,, src] = process.argv

if(!src) {
  console.log('Directory path is missing.')
  return
}

glob(`${src}/**/*.jsx`, {},function (er, files) {

  files.forEach((file) => {

    const parsePath = path.parse(file)
    const dtsFile = `${parsePath.dir}/${parsePath.name}.d.ts`

    let dtsData = react2dts
      .generateFromFile('Components', file)

    dtsData = dtsData
      .trim()
      .slice(0, -1)
      .split('\n')
      .slice(3)
      .map((line) => {
        return line.replace(/^\s{4}/, '')
      })
      .join('\n')
      .replace('const ', 'declare const ')

    fs.writeFileSync(dtsFile, dtsData)

    console.log(`'${dtsFile.replace(src, '')}' created successfully.`)

  })
})
