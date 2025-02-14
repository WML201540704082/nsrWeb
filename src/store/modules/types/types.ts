/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-13 15:00:49
 * 佛祖保佑没bug
 */

import type { CategoryObj } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  userName: string
  avatar: string
  buttons: string[]
  downLoadList: doanloadType[] //文件下载信息
  alarmList: any[] //预警列表
}

export interface CategoryState {
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
}
