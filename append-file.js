const { promises: fs } = require('fs')

async function appendFile (file, data) {
  let filehandle

  try {
    filehandle = await fs.open(file, 'a')
    await filehandle.appendFile(data, { encoding: 'utf-8' })
  } finally {
    if (filehandle) {
      await filehandle.close()
    }
  }
}

module.exports = appendFile
