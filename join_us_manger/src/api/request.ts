import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message } from '@arco-design/web-vue';
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000
})

request.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers.Authorization = localStorage.getItem('token')
    } else {
        // Message.warn('token不存在', )
    }
    return config
})

request.interceptors.response.use((response): any => {
    if (response.status === 200) {
        return response.data
    } else {
      Message.error(response.data.msg, )
    }
})

export default <T>(config: AxiosRequestConfig) => {
    return request(config).then(res => {
        return res
    })
}