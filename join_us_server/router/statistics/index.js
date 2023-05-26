const express = require("express")
const StatisticsRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');

StatisticsRouter.get("/statistics", (req, res) => {
  const { company_id,hr_id } = req.query
  const todayTime = '2023-05-05 11:45:16'
  const getNum = (val) => {
    if (val * 1 >= 10) {
      return val
    } else {
      return '0' + val
    }
  }
  const getTodayDate = () => {
    const timers = new Date().toLocaleDateString()
    if (timers) {
      const arr = timers.split('/')
      return arr[0] + '-' + getNum(arr[1]) + '-' + getNum(arr[2]) 
    }
  }
  if (!company_id || !hr_id) return returnErr(res, '参数错误')
  const degreesSql = `select * from pos where company_id = '${company_id}'`
  const sendSql = `select * from send where company_id = '${company_id}'`
  const hrSql = `select * from hr where company_id = '${company_id}'`
  const todaySendSql = `select * from send where company_id = '${company_id}' and DATE(sendTime) =  '${getTodayDate()}'`

  const dealWithData =  (data,cbArr=false,params)=>{
    if(!data.length) return cbArr?[]:0
    const res  = data.filter(item=>item.hr_id == hr_id)
    if(res.length){
      if(cbArr){
        if(params ==='degrees') {
          return res.map(item=>({degrees:item[params]}))
        }else{
          return res.map(item=>({types:item[params]}))
        }
       
      }else{
        return res.length
      }
    }else{
      if(cbArr){
        return []
      }else{
        return 0
      }
    }
  }
  query(degreesSql, degreesResult => {
    query(sendSql, sendResult => {
      query(hrSql, hrResult => {
        query(todaySendSql, todaySendResult => {
          return res.send(
            {
              code: 200,
              msg: "查询成功",
              companyDegreesData: degreesResult.length?degreesResult.map(item=>({degrees:item.degrees})):[],
              companySendData: sendResult.length?sendResult.map(item=>({types:item.types})):[],
              degreesData:dealWithData(degreesResult,true,'degrees'),  //人事
              sendData:dealWithData(sendResult,true,'types'),   //人事

              todaySend_total:dealWithData(todaySendResult), //今日一已投递
              position_total: dealWithData(degreesResult),  // 总职位数
              send_total: dealWithData(sendResult),   //总投递数量
              hr_total: dealWithData(hrResult),   //人事总数

              //公司
              companyTodaySend_total: todaySendResult.length || 0,//今日一已投递
              companyPosition_total: degreesResult.length || 0,  // 总职位数
              companySend_total: sendResult.length || 0,   //总投递数量


        




            })
        })
      })
    })
  })

})

module.exports = StatisticsRouter