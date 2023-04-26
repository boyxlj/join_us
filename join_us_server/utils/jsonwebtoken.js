const jwt = require('jsonwebtoken')
const secret = 'zhaopin'
module.exports ={
  sendToken:(data,timer)=>{
    return jwt.sign(data, secret, { expiresIn: timer})
  },
  verifyToken:(token)=>{
    try {
      return jwt.verify(token, secret);
    } catch(err) {
      return false
    }
  }
}

