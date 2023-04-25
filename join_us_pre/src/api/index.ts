import request from '@/api/request'
// 用户登陆
export const userLoginReq = (data: Record<string, string>) => {
  return request({
    url: '/userLogin',
    method: 'post',
    data: data
  })
}
// 企业登陆
export const companyLoginReq = (data: Record<string, string>) => {
  return request({
    url: '/companyLogin',
    method: 'post',
    data: data
  })
}
// 注册
export const register = (data: Record<string, string>) => {
  return request({
    url: '/register',
    method: 'post',
    data: data
  })
}
// 发送验证码
export const sendCode = () => {
  return request({
    url: '/code',
    method: 'get'
  })
}
// 获取职位类型
export const getJobType = () => {
  return request({
    url: '/jobtype',
    method: 'get'
  })
}
//获取职位列表
export const getJobList = () => {
  return request({
    url: '/jobList',
    method: 'get'
  })
}

//获取职位列表
export const getPositionList = (data:any) => {
  return request({
    url: '/positions',
    method: 'post',
    data,
  })
}