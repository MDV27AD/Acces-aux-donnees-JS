export default function errorHandler (err, req, res, next) {
  console.error('Error ', err, err.name, err.message, err.errInfo, err.stack)
  // console.error('Error details', err.errInfo.details.schemaRulesNotSatisfied)
  const formattedError = {
    message: err.message || 'An error occurred',
    code: err.statusCode || 500
  }
  console.error('formattedError', formattedError)

  return res.status(formattedError.code).json({ error: formattedError, err })
}
