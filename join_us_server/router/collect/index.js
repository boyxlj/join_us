const express = require("express")
const collectRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
//收藏表

collectRouter.get('/collect',(req,res)=>{
  res.send({code:200,msg:'ok'})
})

//添加收藏
collectRouter.post('/collect', (req, res) => {
  const { userId, position_id, company_id } = req.body
  if (!userId || !position_id ||!company_id  ) return returnErr(res, '参数不合法')
  const selectSql = `select * from collect where userId='${userId}' and position_id='${position_id}' `
  const sql = `insert into collect(userId,position_id,company_id,collect_id) 
  values('${userId}','${position_id}','${company_id}','${uuidv4()}')`
  query(selectSql, selectResult => {
    if (selectResult.length) return returnErr(res, '已经收藏过当前职位，请勿重复操作')
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '收藏失败')
      res.send({ code: 200, msg: '收藏成功' })
    })
  })
})


//查询用户收藏列表
collectRouter.get('/collects', (req, res) => {
  let { userId,pageOn,pageSize } = req.query
  if (!userId || !pageOn || !pageSize) return returnErr(res, '参数不合法')
  if(pageSize>15) pageSize = 15
  const count = `select count(*) from collect where userId='${userId}'  `
  const sql = `select * from collect s  inner join pos p on s.position_id=p.position_id 
  inner join company c on c.company_id = s.company_id 
   where s.userId = '${userId}'  order by s.id desc limit ${(pageOn-1)*pageSize}, ${pageSize} 
  `
  query(count, countResult => {
    query(sql, result => {
      res.send({ code: 200, msg: '查询收藏记录成功',total: countResult[0]['count(*)'],data:result})
    })
  })
  
})

//删除用户收藏
collectRouter.delete('/collect', (req, res) => {
  const { userId, position_id, collect_id } = req.body
  if (collect_id) {
    const sql = `delete from collect where collect_id='${collect_id}'  `
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '取消收藏失败')
      res.send({ code: 200, msg: '取消收藏成功' })
    })
  } else {
    if (!userId || !position_id) return returnErr(res, '参数不合法')
    const sql = `delete from collect where userId='${userId}' and position_id='${position_id}' `
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '取消收藏失败')
      res.send({ code: 200, msg: '取消收藏成功' })
    })
  }

})
module.exports = collectRouter