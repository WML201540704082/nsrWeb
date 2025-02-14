/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-28 20:03:01
 * 佛祖保佑没bug
 */
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { LoginFormData, LoginResponseData } from '@/api/user/type'
import type { UserState } from './types/types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { SET_UserName } from '@/utils/userName'

const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN()!,
      userName: '',
      avatar: '',
      buttons: [],
      downLoadList: JSON.parse(
        window.localStorage.getItem('downloadFileItem') || '[]',
      ), //文件下载列表
      alarmList: [], //预警列表
    }
  },
  // 异步|逻辑的地方
  actions: {
    //用户登录方法
    async userLogin(data: LoginFormData) {
      const res: LoginResponseData = await reqLogin(data)
      if (res.code === 200) {
        this.userName = res.data.userName as string
        this.token = res.data.token as string
        // 持久化
        SET_TOKEN(res.data.token as string)
        SET_UserName(res.data.userName as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data as string))
      }
    },
    async userLogout() {
      // const res = await reqLogOut()
      // if (res.code === 200) {
      this.token = ''
      // this.userName = ''
      this.avatar = ''
      REMOVE_TOKEN()
      // } else {
      //   return Promise.reject(new Error(res.message))
      // }
    },
  },
  getters: {},
})

export default useUserStore
