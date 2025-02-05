export default function errorHandler (err, req, res) {
  console.error('Error', err)
  const formattedError = {
    message: err.message || 'An error occurred',
    code: err.statusCode || 500
  }
  console.error('formattedError', formattedError)

  return res.status(formattedError.code).json({ error: formattedError, err })
}
