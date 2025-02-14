/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-10 11:48:34
 * 佛祖保佑没bug
 */
// 登录接口需要携带参数ts类型
export interface LoginFormData {
  userName?: string
  password?: string
}

export interface ResponseData {
  code?: number
  message?: string
}

export interface LoginResponseData extends ResponseData {
  data?: any
}
