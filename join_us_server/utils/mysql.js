const mysql2 = require('mysql2')
const sqlConfig = require('../config/sqlConfig')
const client = mysql2.createPool(sqlConfig).promise()


const query = async (sql, callback) => {
  try { 
    const res = await client.query(sql)
    callback(res[0])
  } catch (err) { 
    callback('err',err)
    console.log("数据库连接异常",err)
  }
}

module.exports = query

