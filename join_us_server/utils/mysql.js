const mysql2 = require('mysql2')
const client = mysql2.createPool({
  host:'localhost',
  user: 'root',
  password: '111111',
  database: 'join_us',
  port: '3306',
  connectionLimit: 10,
}).promise()


const query = async (sql, callback) => {
  try { 
    const res = await client.query(sql)
    callback(res[0])
  } catch (err) { 
    console.log("数据库连接异常")
  }
}

module.exports = query

