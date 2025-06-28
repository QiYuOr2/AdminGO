const path = require('node:path')
const process = require('node:process')
const fs = require('fs-extra')
const yaml = require('yaml')

const localesDir = path.resolve(__dirname, '../locals')
const outputDir = path.resolve(__dirname, '../apps/web/public/locales')

async function convertLocales() {
  try {
    await fs.ensureDir(outputDir)
    const files = await fs.readdir(localesDir)

    for (const file of files) {
      if (path.extname(file) === '.yml') {
        const lang = path.basename(file, '.yml')
        const filePath = path.join(localesDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const data = yaml.parse(content)

        const outputFilePath = path.join(outputDir, `${lang}.json`)
        await fs.writeJson(outputFilePath, data, { spaces: 2 })
        console.log(`Converted ${file} to ${lang}.json`)
      }
    }
  }
  catch (error) {
    console.error('Error converting locales:', error)
    process.exit(1)
  }
}

convertLocales()
