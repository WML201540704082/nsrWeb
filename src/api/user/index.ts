/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-28 16:22:20
 * 佛祖保佑没bug
 */
// 统一管理用户相关接口
import request from '@/utils/request'
import type { LoginFormData, LoginResponseData } from './type'

enum API {
  LOGIN_URL = '/web/login',
  USERINFO_URL = '/nvr/record/list',
  LOGOUT_URL = '/admin/acl/index/logout',
}

export const reqLogin = (data: LoginFormData) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)

export const reqLogOut = () => request.post<any, any>(API.LOGOUT_URL)
