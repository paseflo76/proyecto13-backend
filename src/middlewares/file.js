const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

//? Funcion para poder subir archivo a cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, _file) => {
    const folderName = req.body.folder || 'libros'

    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
    }
  }
})

const upload = multer({ storage })

module.exports = upload
