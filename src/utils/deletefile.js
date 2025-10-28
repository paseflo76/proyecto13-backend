const cloudinary = require('cloudinary').v2

//TODO:  Eliminar archivo de Cloudinary por URL

const deleteFile = (url) => {
  if (!url) {
    console.warn('URL no válida para eliminar la imagen')
    return
  }

  try {
    const imgSplited = url.split('/')
    const folderName = imgSplited.at(-2)
    const fileName = imgSplited.at(-1).split('.')[0]

    if (!folderName || !fileName) {
      console.warn('No se pudo extraer folder o filename correctamente')
      return
    }

    const publicId = `${folderName}/${fileName}`

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error al eliminar en Cloudinary:', error)
      } else {
        console.log('Imagen eliminada de Cloudinary:', result)
      }
    })
  } catch (err) {
    console.error('Error en deleteFile:', err.message)
  }
}

module.exports = { deleteFile }
