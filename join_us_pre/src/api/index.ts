import request from '@/api/request'
export const userLoginReq = (data: Record<string, string>) => {
    return request({
        url: '/userLogin',
        method: 'post',
        data: data
    })
}

export const companyLoginReq = (data: Record<string, string>) => {
    return request({
        url: '/companyLogin',
        method: 'post',
        data: data
    })
}

export const register = (data: Record<string, string>) => {
    return request({
        url: '/register',
        method: 'post',
        data: data
    })
}

export const sendCode = () => {
    return request({
        url: '/code',
        method: 'get'
    })
}

export const getJobType = () => {
    return request({
        url: '/jobtype',
        method: 'get'
    })
}

export const getJobList = () => {
    return request({
        url: '/jobList',
        method: 'get'
    })
}