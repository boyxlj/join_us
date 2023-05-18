const industryRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')

//查询所有行业
industryRouter.get('/industrys', (req, res) => {
  const sql = `select  * from industry where industry_state='1'  order by  id desc `
  query(sql, (result) => {
    const RES = result.map(item=>{
      return {
        id:item.id,
        industry_id:item.industry_id,
        industry_name:item.industry_name
      }
    })
    res.send({
      code: 200,
      msg: '查询成功',
      data: RES,
    })
  })
})

module.exports = industryRouter