const express = require("express");
const positionRouter = express.Router();
const query = require("../../utils/mysql");
const {returnErr} = require("../../utils/returnErr.js")

//职位信息表  post:参数传递{}
//http://localhost:3303/api/positions?pageOn=1&pageSize=20&experiences=1%E5%B9%B4%E4%BB%A5%E5%86%85
positionRouter.post('/positions', (req, res) => {
  let { pageOn, pageSize } = req.body
  // console.log(req.body)
  const arr = ['pageOn', 'pageSize', 'position_name', 'cityName', 'salary', 'pos_region', 'experiences', 'degrees',
    'position_type1', 'position_type2', 'job_type', 'people_num', 'company_name', 'industry', 'financing'
  ]
  delete req.body.pageOn
  delete req.body.pageSize
  if (req.body.cityName == '全国') {
    delete req.body.cityName
    let str = ''
    function getKeySql(val) {
      return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    }
    let vsKey = 'where '
    if (req.body.keyword) {
      vsKey += getKeySql(req.body.keyword)
    } else {
      vsKey = ''
    }
    for (let i in req.body) {
      if (!arr.includes(i)) {
        delete req.body[i]
      }
    }
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and ${i} = '${req.body[i]}' `
      }
    } else {
      str = ''
    }
    let ResStr = ''
    if (str || vsKey) {
      vsKey = vsKey ? vsKey : 'where'
      if (vsKey == 'where') {
        str = str.slice(4)
      }
      ResStr = !vsKey == 'where' ? vsKey + ' and ' + str : vsKey + str
    } else {
      ResStr = ''
    }
    if (pageSize >= 10) {
      pageSize = 10
    }
    if(ResStr.includes('where')){
      ResStr+=` and pos.position_state = '1'`
    }else{
      ResStr+=` where pos.position_state = '1'`
    }
    const sqlCount = `select count(*) from  pos inner join company on pos.company_id = company.company_id ${ResStr}`
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${ResStr}  order by pos.id desc 
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  } else {
    let str = ''
    function getKeySql(val) {
      return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    }
    let vsKey = 'where '
    if (req.body.keyword) {
      vsKey += getKeySql(req.body.keyword)
    } else {
      vsKey = ''
    }
    for (let i in req.body) {
      if (!arr.includes(i)) {
        delete req.body[i]
      }
    }
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and ${i} = '${req.body[i]}' `
      }
    } else {
      str = ''
    }
    let ResStr = ''
    if (str || vsKey) {
      vsKey = vsKey ? vsKey : 'where'
      if (vsKey == 'where') {
        str = str.slice(4)
      }
      ResStr = !vsKey == 'where' ? vsKey + ' and ' + str : vsKey + str
    } else {
      ResStr = ''
    }
    if (pageSize >= 10) {
      pageSize = 10
    }
    if(ResStr.includes('where')){
      ResStr+=` and pos.position_state = '1'`
    }else{
      ResStr+=` where pos.position_state = '1'`
    }
    const sqlCount = `select count(*)  from  pos inner join company on pos.company_id = company.company_id ${ResStr} order by pos.id desc
  `
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${ResStr} order by pos.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `


    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  }


})


//热招职位查询  get:参数传递 position_type1  num(可选)
positionRouter.get("/position/hotSearch", (req, res) => {
  let { position_type1, num = 9 } = req.query
  if (num <= 6 || num > 20) {
    num = 9
  }
  const sql= `select * from pos inner join company on pos.company_id = company.company_id where position_type1='${position_type1}' and position_state = '1' order by pos.id desc limit ${num}`
  query(sql,result=>{
    if(result.length){
      res.status(200).send({code:200,msg:'请求成功',data:result})
    }else{
      res.status(200).send({code:200,msg:'请求成功',data:[]})
    }
  })
})

//热搜职位  get:参数传递position_name
positionRouter.get("/position/hot", (req, res) => {
  const random = Math.floor(Math.random() * (10 + 1 - 6)) + 6
  let {cityName} = req.query
  if(!cityName) return res.status(400).send({ code: 400, msg: '参数错误', data: null })
  let str = ''
  if(cityName=='全国'){
    str = `where position_state = '1'`
  }else{
    str = `where position_state = '1' and cityName = '${cityName}'`
  }
  const sql = `select position_name from pos  ${str}  order by rand() limit ${random} `
  query(sql, result => {
 
    if (result.length) {
      res.status(200).send({ code: 200, msg: '请求成功', data: [...new Set(result?.map(item => item.position_name)?.filter(item=>item.length<=13))] })
    } else {
      str = ``
      const sql1 = `select position_name from pos ${str} order by rand() limit ${random} `
      query(sql1, result1 => {
        if (result1.length) {
          res.status(200).send({ code: 200, msg: '请求成功', data: [...new Set(result1?.map(item => item.position_name)?.filter(item=>item.length<=13))] })
        } 
      })
    }
  })
})


//随机查询职位列表  get:参数传递cityName,num,isRandom,sortNum,
positionRouter.get("/position/by/rand", (req, res) => {
  let {isRandom=true, num,cityName,sortNum} = req.query
  if(!cityName) return res.status(400).send({code:400,msg:'参数错误',data:null})
  
   if(!num){
    num = Math.floor(Math.random() * (8 + 1 - 4)) + 4
   }else{
     num>=15?num=15:num=num
     num<=2?num=2:num=num
   }
   if(!sortNum){
    sortNum = Math.floor(Math.random() * (10 + 1 - 5)) + 5
   }else{
    sortNum>=15?sortNum=15:sortNum=sortNum
    sortNum<=2?sortNum=2:sortNum=sortNum
   }
   
  var str = ''
  if(isRandom){
    str = 'order by rand()'
  }

  let cityStr = `where pos.position_state = '1'`
  if(cityName!='全国'){
    cityStr = `where pos.position_state = '1' and cityName='${cityName}' `
  }
  const sortSql = `select * from pos inner join company on pos.company_id = company.company_id  where pos.position_state = '1'  order by pos.id desc limit ${sortNum} `
  const randomSql = `select * from pos inner join company on pos.company_id = company.company_id    ${cityStr}  ${str}  limit ${num} `
  query(randomSql, randomResult => {
    if (randomResult.length) {
      if(randomResult=='err')  return returnErr(res)
      query(sortSql, sortResult => {
        if(sortResult=='err')  return returnErr(res)
        if (sortResult.length) {
          res.status(200).send({ code: 200, msg: '请求成功', data: {sortPositionData:sortResult,randomPositionData:randomResult} })
        } else {
          res.status(200).send({ code: 200, msg: '请求成功', data: {sortPositionData:[],randomPositionData:[]} })
        }
      })
    } else {
      res.status(400).send({ code: 400, msg: '请求失败', data: null })
    }
  })
})

// 职位详情接口,query参数传递position_id
positionRouter.get("/positionDetail", (req, res) => {
  const position_id = req.query.position_id;
  const sql = `select * from company, pos where pos.company_id = company.company_id and position_id = '${position_id}'`;
  query(sql, (result) => {
    res.send({
      code: 200,
      msg: "请求成功",
      data: result[0],
    });
  });
});




module.exports = positionRouter;
