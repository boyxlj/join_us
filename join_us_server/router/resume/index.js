const express = require("express")
const resumeRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require("../../utils/returnErr")
const { v4: uuidv4 } = require('uuid');
//简历表

// 查询用户简历
resumeRouter.post('/user/resume', (req, res) => {
  const { userId } = req.body
  if (!userId) return returnErr(res, "参数不合法")
  const sql = ` select * from resume  where userId = '${userId}'`
  query(sql, result => {
    res.send({ code: 200, msg: '查询成功', data: result })
  })
})


// 修改用户简历
resumeRouter.patch('/user/resume', (req, res) => {
  let { resume_id, company, industry, post, department, enter_time, leave_time, content, performance, skill } = req.body
  if (!resume_id) return returnErr(res, "参数不合法")
  const sql = `update resume set 
  company = '${company}',
  industry = '${industry}',
  post = '${post}',
  department = '${department}',
  enter_time = '${enter_time}',
  leave_time = '${leave_time}',
  content = '${content}',
  performance = '${performance}',
  skill = '${skill}' where resume_id='${resume_id}'
  `
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null })
    } else {
      return returnErr(res, '修改失败')
    }
  })
})

//添加用户简历
resumeRouter.post('/user/add/resume', (req, res) => {
  let { userId, company, industry, post, department, enter_time, leave_time, content, performance, skill } = req.body
  if (!userId) return returnErr(res, "参数不合法")
  const sql = `insert into resume(
    userId, company,industry,post,department,enter_time,leave_time,content,performance, skill, resume_id)
     values(
      '${userId}','${company}','${industry}','${post}','${department}','${enter_time}','${leave_time}','${content}',
      '${performance}','${skill}','${uuidv4()}'
    )
    `
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '添加成功', data: null })
    } else {
      return returnErr(res, '添加失败')
    }
  })
})
resumeRouter.patch('/user/resume1', (req, res) => {
  let saveUserId = ''
  const { userId } = req.body

  const validateTypeName = [
    "userId",
    "company",
    "industry",
    "post",
    "department",
    "enter_time",
    "leave_time",
    "content",
    "performance",
    "skill",
    "addTime",
    "update_time"
  ]
  saveUserId = userId
  delete req.body.userId
  for (let i in req.body) {
    if (validateTypeName.findIndex((item) => item === i) == -1) {
      delete req.body[i]
    }
  }
  for (let i in req.body) {
    if (!req.body[i]) {
      delete req.body[i]
    }
  }
  let str = 'set'
  if (Object.keys(req.body).length) {
    for (let i in req.body) {
      str += ` ${i} = '${req.body[i]}',`
    }
    str = str.slice(0, str.length - 1)
  } else {
    str = ''
    return returnErr(res, '参数不合法')
  }
  if (!saveUserId) return returnErr(res, '参数不合法')

  const sql = `update userinfo ${str} where userId = '${saveUserId}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null })
    } else {
      return returnErr(res, '用户信息修改失败')
    }
  })
})


module.exports = resumeRouter