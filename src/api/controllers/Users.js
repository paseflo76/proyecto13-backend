const { validateRegister } = require('../../utils/validateUser')
const bcrypt = require('bcrypt')
const User = require('../models/Users')
const { generateSign } = require('../../config/jwt')

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

const getUserById = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: 'ID de usuario requerido' })
  try {
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    return res.status(200).json(user)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error interno', details: error.message })
  }
}

const register = async (req, res) => {
  console.log('Body recibido:', req.body) // revisar qué llega del frontend
  const { valid, errors } = validateRegister(req.body)
  console.log('Resultado validación:', { valid, errors }) // revisar qué campos fallan

  if (!valid)
    return res.status(400).json({ message: 'Datos inválidos', errors })

  try {
    const { userName, email, password } = req.body
    const duplicateUser = await User.findOne({ $or: [{ userName }, { email }] })
    if (duplicateUser) return res.status(400).json('Nombre o email ya en uso')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: 'reader'
    })
    const userSaved = await newUser.save()

    const token = generateSign(userSaved._id, userSaved.role)
    const { password: _, ...userData } = userSaved._doc
    return res.status(201).json({ user: userData, token })
  } catch (error) {
    return res.status(400).json({ message: 'Error al registrar usuario' })
  }
}

const login = async (req, res) => {
  const { userName, password } = req.body
  if (!userName || !password)
    return res.status(400).json({ message: 'Faltan campos obligatorios' })

  try {
    const user = await User.findOne({ userName })
    if (!user)
      return res
        .status(400)
        .json({ message: 'El usuario o la contraseña son incorrectos' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(400).json({ message: 'Credenciales incorrectas' })

    const token = generateSign(user._id, user.role)
    const { password: _, ...userData } = user._doc

    res.status(200).json({ user: userData, token })
  } catch (error) {
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { role, ...data } = req.body

    //? Solo admin puede cambiar roles
    if (role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No autorizado para cambiar role' })
    }

    //? El usuario solo puede modificar su propio perfil (excepto admin)
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No autorizado para modificar este usuario' })
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { ...data, ...(role && { role }) },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar usuario',
      details: error.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // El usuario solo puede borrarse a sí mismo, salvo que sea admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'No autorizado para eliminar este usuario' })
    }

    const deleted = await User.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (deleted.avatar) {
      await deleteFile(deleted.avatar)
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar usuario',
      details: error.message
    })
  }
}

module.exports = {
  getUsers,
  getUserById,
  getMyProfile,
  register,
  login,
  updateUser,
  deleteUser
}
