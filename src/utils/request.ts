/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-08 17:20:07
 * @LastEditors: wml
 * @LastEditTime: 2024-07-11 17:25:33
 * 佛祖保佑没bug
 */
// 二次封装axios
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import router from '@/router'
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
let showMsg = true
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers['Authorization'] = 'Bearer ' + userStore.token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => {
    let message = ''
    const status = error.response?.status
    switch (status) {
      case 401 || 401000:
        useUserStore().userLogout()
        message = '登录过期！'
        router.push('/login')
        break
      case 403:
        message = '禁止访问'
        break
      case 404:
        message = '网络请求不存在'
        break
      case 500:
        message = '服务器出现问题！'
        break
      default:
        message = error.response?.data?.message || '服务请求失败'
        break
    }
    if (showMsg) {
      ElMessage({ type: 'error', message })
      showMsg = false
      setTimeout(() => {
        showMsg = true
      }, 1000)
    }
    return Promise.reject(error)
  },
)

export default request
