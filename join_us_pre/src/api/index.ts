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
// // 注册
// export const register = (data: Record<string, string>) => {
//   return request({
//     url: '/register',
//     method: 'post',
//     data: data
//   })
// }
// // 发送验证码
// export const sendCode = () => {
//   return request({
//     url: '/code',
//     method: 'get'
//   })
// }

// //获取职位列表
// export const getJobList = () => {
//   return request({
//     url: '/jobList',
//     method: 'get'
//   })
// }
//获取职位类型
export const getPositionType = () => {
  return request({
    url: '/positionType',
    method: 'get'
  })
}

//查询职位列表
export const getPositionList = (data:any) => {
  return request({
    url: '/positions',
    method: 'post',
    data,
  })
}
//查询首页搜索框热搜职位列表
export const getPositionHotSearchList = () => {
  return request({
    url: `/position/hot`,
    method: 'get'
  })
}

//查询首页热招职位列表
export const getPositionByHot = (position_type1: string) => {
  return request({
    url: `/position/hotSearch?position_type1=${position_type1}`,
    method: 'get'
  })
}
// 获取职位详情
export const getJobDetail = (position_id: string) => {
    return request({
        url: `/positionDetail`,
        method: 'get',
        params: {
            position_id: position_id
        }
    })
}