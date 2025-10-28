require('dotenv').config()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { connectDB } = require('../../config/db')
const User = require('../../api/models/Users')
const { csvAll, validateRequiredFields } = require('./csvreusable/csvall')

async function seedUsers() {
  try {
    await connectDB()

    const csvPath = path.join(__dirname, 'data', 'user.csv')
    if (!fs.existsSync(csvPath))
      throw new Error('Archivo user.csv no encontrado')

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const users = csvAll(csvContent)

    const requiredFields = ['userName', 'email', 'password']
    const validUsers = users.filter((user) =>
      validateRequiredFields(user, requiredFields)
    )

    const usersWithHashedPasswords = await Promise.all(
      validUsers.map(async (user) => ({
        userName: user.userName,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        role: user.role || 'reader'
      }))
    )

    await User.deleteMany({})
    await User.insertMany(usersWithHashedPasswords)

    console.log(
      `Seed completado: ${usersWithHashedPasswords.length} usuarios insertados.`
    )
  } catch (error) {
    console.error('Error en seedUsers:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

if (require.main === module) seedUsers()
module.exports = { seedUsers }
