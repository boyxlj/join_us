const express = require("express");
const positionRouter = express.Router();
const query = require("../../utils/mysql");
//职位信息表  post:参数传递{}
//http://localhost:3303/api/positions?pageOn=1&pageSize=20&experiences=1%E5%B9%B4%E4%BB%A5%E5%86%85
positionRouter.post('/positions', (req, res) => {
  let { pageOn, pageSize } = req.body
  // console.log(req.body)
  const arr = ['pageOn', 'pageSize', 'position_name', 'cityName', 'salary', 'region', 'experiences', 'degrees',
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
    const sqlCount = `select count(*) from  pos inner join company on pos.company_id = company.company_id ${ResStr}`
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${ResStr} order by pos.id desc
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
  const sql = `select * from pos where position_type1='${position_type1}' order by id desc limit ${num}`
  query(sql, result => {
    if (result.length) {
      res.status(200).send({ code: 200, msg: '请求成功', data: result })
    } else {
      res.status(200).send({ code: 200, msg: '请求成功', data: [] })
    }
  })
})

//热搜职位  get:参数传递position_name
positionRouter.get("/position/hot", (req, res) => {
  const random = Math.floor(Math.random() * (10 + 1 - 6)) + 6
  const sql = `select position_name from pos order by rand() limit ${random} `
  query(sql, result => {
    if (result.length) {
      res.status(200).send({ code: 200, msg: '请求成功', data: [...new Set(result?.map(item => item.position_name))] })
    } else {
      res.status(200).send({ code: 200, msg: '请求成功', data: [] })
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
