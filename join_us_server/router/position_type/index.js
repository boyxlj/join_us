const express = require("express")
const positionTypeRouter = express.Router()
const query = require('../../utils/mysql')
//职位类型表


// 职位类型接口
positionTypeRouter.get('/positionType', (req, res) => {
  const sql = 'select * from position_type'
  query(sql, (result) => {
    const firstArr = result.filter(item => item.parent === 'null')
    const secondArr = result.filter(item => item.parent !== 'null')
    const firstResArr = firstArr.map(item => {
      return {
				position_type_id: item.position_type_id,
        position_type_name: item.type_name,
        children: []
			}
    })
    secondArr.forEach((item, index) => {
      if (firstResArr.findIndex((item2) => item2.position_type_id === item.parent) !== -1) {
        firstResArr[
					firstResArr.findIndex(
						(item2) => item2.position_type_id === item.parent
					)
				].children.push(item)
      }
    })
    res.send({
      code: 200,
      msg: '请求成功',
      data: firstResArr
    })
  })
})

module.exports = positionTypeRouter