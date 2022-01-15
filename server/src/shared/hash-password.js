let bcrypt = require('bcryptjs')

module.exports = async function (plaintextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err)
      bcrypt.hash(plaintextPassword, salt, (error, hash) => {
        if (error) reject(error)
        resolve(hash)
      })
    })
  })
}