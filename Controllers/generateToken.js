const jwt = require('jsonwebtoken')

function generateToken(user) {
  try {
    const token = jwt.sign({
      username: user.username,
      role: user.role
    }, process.env.SECRET_KEY)
    return token
  } catch (error) {
    console.log(error.message)
    return
  }
}

module.exports = generateToken