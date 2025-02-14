/*
 * @Description: Stay hungry，Stay foolish
 * @Author: zxk
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-24 10:46:33
 * 佛祖保佑没bug
 */
// 文件下载
import request from '@/utils/request'
import type { getFileInfoType, areaListReqType, fileAreaReqType } from './type'

enum API {
  LOGIN_URL = '/area',
  AREA_URL = '/area', //区域及相机信息查询
  AREALIST_URL = '/record/file/area/list', //文件查询按区域
  fileArea_URL = '/record/file/area', //请求下载文件
  fileAreaStatus_URL = '/record/file/area/status', //文件请求查询
  AreaCalenda_URL = '/record/file/area/calenda', //日历检索
  Space_url = '/web/notify', //磁盘信息查询接口
}

export const getFileInfo = (data: any) => {
  return request({
    url: API.Space_url,
    method: 'get',
    params: data,
  })
}

const areaMenus = (data?: any) => {
  return request({
    url: API.AREA_URL,
    method: 'get',
    params: data,
  })
}

const areaList = (data: areaListReqType) => {
  return request({
    url: API.AREALIST_URL,
    method: 'post',
    data,
  })
}

const fileArea = (data: fileAreaReqType) => {
  return request({
    url: API.fileArea_URL,
    method: 'post',
    data,
  })
}
const fileAreaStatus = (data: { sessionId: string }) => {
  return request({
    url: API.fileAreaStatus_URL,
    method: 'get',
    params: data,
  })
}

const areaCalenda = (data: areaListReqType) => {
  return request({
    url: API.AreaCalenda_URL,
    method: 'post',
    data,
  })
}

export default {
  areaMenus,
  areaList,
  fileArea,
  fileAreaStatus,
  areaCalenda,
}
