import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000
})

request.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers.Authorization = localStorage.getItem('token')
    } else {
        // message.warn('token不存在', 1)
    }
    return config
})

request.interceptors.response.use((response): any => {
    if (response.status === 200) {
        return response.data
    } else {
        message.error(response.data.msg, 1)
    }
})

export default <T>(config: AxiosRequestConfig) => {
    return request(config).then(res => {
        return res
    })
}