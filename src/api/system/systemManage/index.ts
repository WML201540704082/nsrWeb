/*
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-24 10:23:20
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-28 16:24:05
 * 佛祖保佑没bug
 */
import request from '@/utils/request'
import type { NetworkType, DateTimeType } from './type'
enum API {
  API_NET_URL = '/web/system/net',
  API_DATETIME_URL = '/web/system/time',
  API_PlATFORM_URl = '/web/platform',
  API_RECORD_CONFIG_URL = '/web/record/config',
}
export const queryNetwork = () => {
  return request({
    url: API.API_NET_URL,
  })
}
export const putNetwork = (data: NetworkType) => {
  return request({
    url: API.API_NET_URL,
    method: 'put',
    data,
  })
}
export const queryDateTime = () => {
  return request({
    url: API.API_DATETIME_URL,
  })
}
export const putDateTime = (data: DateTimeType) => {
  return request({
    url: API.API_DATETIME_URL,
    method: 'put',
    data,
  })
}
export const queryPlatform = (type: string) => {
  return request({
    url: `${API.API_PlATFORM_URl}/${type}`,
  })
}
export const putPlatform = (data: any) => {
  return request({
    url: `${API.API_PlATFORM_URl}/NSR`,
    method: 'put',
    data,
  })
}
export const getRecordConfig = () => {
  return request({
    url: API.API_RECORD_CONFIG_URL,
  })
}
export const postRecordConfig = (data: any) => {
  return request({
    url: API.API_RECORD_CONFIG_URL,
    method: 'post',
    data,
  })
}
