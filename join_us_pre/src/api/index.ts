import request from '@/api/request'
// 用户登陆
export const userLogin = (data:{email:string,validateCode:string}) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

//用户发送验证码
export const userSendCode = (email:string) => {
  return request({
    url: '/user/email/coder',
    method: 'post',
    data: {
      email
    }
  })
}

//获取用户信息
export const getUser = (userId:string) => {
  return request({
    url: '/user',
    method: 'post',
    data: {
      userId
    }
  })
}

//修改用户信息
export const updateUser = (data:any) => {
  return request({
    url: '/user',
    method: 'patch',
    data
  })
}
//添加用户简历
export const addUserResume = (data:any) => {
  return request({
    url: '/user/add/resume',
    method: 'post',
    data
  })
}
//修改用户简历
export const updateUserResume = (data:any) => {
  return request({
    url: '/user/resume',
    method: 'patch',
    data
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
export const getPositionHotSearchList = (cityName:string) => {
  return request({
    url: `/position/hot?cityName=${cityName}`,
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

//随机排序查询职位列表  /position/by/rand?cityName=天津&num=6&isRandom=true
export const getSortOrRandomPosition = (data:{cityName:string,num?:number,isRandom?:boolean}) => {
  return request({
      url: `/position/by/rand`,
      method: 'get',
      params: data
  })
}