positionRouter.post('/positions', (req, res) => {
  let { pageOn, pageSize } = req.body
  const arr = ['pageOn', 'pageSize', 'position_name', 'cityName', 'salary', 'region', 'experiences', 'degrees',
    'position_type1', 'position_type2', 'job_type', 'people_num', 'company_name', 'industry', 'financing'
  ]
  delete req.body.pageOn
  delete req.body.pageSize
  if (req.body.cityName=='全国') {
    let str = 'where'
    delete req.body.cityName
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        if (arr.includes(i)) {
          str += ` ${i} = '${req.body[i]}' and`
        }else{
          str=''
        }
      }
    } else {
      str = ''
    }
    if(str){
      str = str?.slice(0, str.length - 3)
    }
    if (pageSize >= 10) {
      pageSize = 10
    }

    const sqlCount = `select count(*) from  pos inner join company on pos.company_id = company.company_id`
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${str} order by pos.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  } else {
    let str = 'where'
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        if (arr.includes(i)) {
          str += ` ${i} = '${req.body[i]}' and`
        }
      }
    } else {
      str = ''
    }
    str = str?.slice(0, str.length - 3)
    if (pageSize >= 10) {
      pageSize = 10
    }
    const sqlCount = `select count(*)  from  pos inner join company on pos.company_id = company.company_id ${str} order by pos.id desc
  `
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${str} order by pos.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  }


})
