const express = require("express")
const sendRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
//投递记录表

//添加投递记录
sendRouter.post('/send', (req, res) => {
  const { userId, position_id, company_id,hr_id } = req.body
  if (!userId || !position_id ||!company_id  ) return returnErr(res, '参数不合法')
  const selectSql = `select * from send where userId='${userId}' and position_id='${position_id}' `
  const sql = `insert into send(userId,position_id,company_id,sendId,hr_id) 
  values('${userId}','${position_id}','${company_id}','${uuidv4()}','${hr_id}')`
  query(selectSql, selectResult => {
    if (selectResult.length) return returnErr(res, '已投递当前职位，请勿重复投递')
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '投递失败')
      res.send({ code: 200, msg: '投递成功' })
    })
  })
})


//查询用户投递记录
sendRouter.get('/sends', (req, res) => {
  let { userId,pageOn,pageSize,types=0 } = req.query
  if (!userId || !pageOn || !pageSize) return returnErr(res, '参数不合法')
  if(pageSize>15) pageSize = 15
  //人事  inner join hr h on h.hr_id = s.hr_id     and p.position_state='1'
  const count = `select count(*) from send where userId='${userId}' and types='${types}' `
  const sql = `select * from send s  inner join pos p on s.position_id=p.position_id 
  inner join company c on c.company_id = s.company_id 
   where s.userId = '${userId}' and s.types='${types}'  order by s.id desc limit ${(pageOn-1)*pageSize}, ${pageSize} 
  `
  query(count, countResult => {
    query(sql, result => {
      res.send({ code: 200, msg: '查询投递记录成功',total: countResult[0]['count(*)'],data:result})
    })
  })
  
})


//删除(取消)用户投递记录
sendRouter.delete('/send', (req, res) => {
  const { userId, position_id, sendId } = req.body
  if (sendId) {
    const sql = `delete from send where sendId='${sendId}'  `
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '取消投递失败')
      res.send({ code: 200, msg: '取消投递成功' })
    })
  } else {
    if (!userId || !position_id) return returnErr(res, '参数不合法')
    const sql = `delete from send where userId='${userId}' and position_id='${position_id}' `
    query(sql, result => {
      if (result.affectedRows < 1) return returnErr(res, '取消投递失败')
      res.send({ code: 200, msg: '取消投递成功' })
    })
  }

})

//获取用户的收藏和投递状态
sendRouter.get('/state',(req,res)=>{
  let { userId,position_id,} = req.query
  if (!userId || !position_id ) return returnErr(res, '参数不合法')
  const sendSql = `select * from send where userId = '${userId}' and position_id = '${position_id}'`
  const collectSql = `select * from collect where userId = '${userId}' and position_id = '${position_id}'`
  query(sendSql,sendRes=>{
    query(collectSql,collectRes=>{
      res.send({code:200,msg:"查询成功",sendState:sendRes.length?true:false,collectState:collectRes.length?true:false})
    
    })
  })
})

//查询用户所有投递状态(数量)
sendRouter.get('/send/num',(req,res)=>{
  let { userId} = req.query
  if (!userId ) return returnErr(res, '参数不合法')
  const sendSql = `select * from send where userId = '${userId}'  `
  const collectSql = `select * from collect where userId = '${userId}'`
  query(sendSql,sendRes=>{
    query(collectSql,collectRes=>{
      const sendAllNum =  sendRes?.filter(item=>item.types==='0')?.length || 0
      const sendOkNum = sendRes?.filter(item=>item.types==='1')?.length || 0
      const sendErrNum =  sendRes?.filter(item=>item.types==='2')?.length || 0
      const collectNum =  collectRes.length>0?collectRes.length:0
      res.send({code:200,msg:"查询成功",data:{sendNum:{sendAllNum,sendOkNum,sendErrNum,collectNum}}})
    })
  })
})
module.exports = sendRouter