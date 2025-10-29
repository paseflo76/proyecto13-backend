
//TODO:  Validar datos de usuario para registro

const userRegisterSchema = {
  userName: (value) =>
    typeof value === 'string' && value.length >= 3 && value.length <= 20,
  email: (value) => typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value),
  password: (value) => typeof value === 'string' && value.length >= 6
}

const validate = (schema) => (data) => {
  const errors = Object.entries(schema)
    .filter(([key, validateFn]) => !validateFn(data[key]))
    .map(([key]) => key)

  return {
    valid: errors.length === 0,
    errors
  }
}

module.exports = {
  validateRegister: validate(userRegisterSchema)
}
