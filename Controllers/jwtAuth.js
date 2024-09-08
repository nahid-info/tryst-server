const jwt = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const jwtToken = authHeader && authHeader.split(' ')[1]

  if (!jwtToken) {
    return res.status(401).json({
      success: flase,
      message: 'Access token is missing or invalid!'
    })
  }
  try {
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    console.log(error.message)
    res.status(403).json({
      success: false,
      message: 'Unauthorized'
    })
  }
}


module.exports = jwtAuth