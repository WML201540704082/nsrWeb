/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-10 15:31:50
 * @LastEditors: wml
 * @LastEditTime: 2023-11-10 15:31:58
 * 佛祖保佑没bug
 */
export const SET_UserName = (userName: string) => {
  localStorage.setItem('UserName', userName)
}

export const GET_UserName = () => {
  return localStorage.getItem('UserName')
}

export const REMOVE_UserName = () => {
  localStorage.removeItem('UserName')
}
