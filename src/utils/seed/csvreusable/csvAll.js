//TODO:  Funciones reutilizables para procesar CSV
/**
 * Convierte el contenido de un CSV en un array de objetos
 */

function csvAll(csvContent) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const line = lines[i]
    const values = []
    let currentValue = ''
    let insideQuotes = false

    for (let char of line) {
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim())
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    const item = {}
    headers.forEach((header, index) => {
      let value = values[index]

      if (value === 'true') value = true
      if (value === 'false') value = false

      item[header] = value
    })

    data.push(item)
  }

  return data
}

/**
 * Valida que un objeto tenga los campos requeridos
 */
function validateRequiredFields(item, requiredFields) {
  return requiredFields.every(
    (field) => item[field] !== undefined && item[field] !== ''
  )
}

module.exports = { csvAll, validateRequiredFields }
