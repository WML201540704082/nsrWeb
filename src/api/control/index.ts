/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-23 20:03:29
 * @LastEditors: wml
 * @LastEditTime: 2023-11-27 15:02:16
 * 佛祖保佑没bug
 */
import request from '@/utils/request'
import type { AreaResponseData, RecordStartData, RecordEndData } from './type'

// 区域及相机信息查询
export const reqAreaList = () => request.get<any, AreaResponseData>('/area')

// 获取录像状态
export const reqRecordStatus = () => request.get<any, any>('/record/status')

// 开始录制
export const reqRecordStart = (data: RecordStartData) =>
  request.post<any, any>('/record/start', data)

// 结束录制
export const reqRecordEnd = (data: RecordEndData) =>
  request.post<any, any>('/record/stop', data)

// 获取预览视频url
export const reqPreviewUrl = (params?: any) => {
  return request({
    url: '/preview',
    method: 'get',
    params: params,
  })
}

// 截图--获取实时帧
export const reqInstantFrame = (params?: any) => {
  return request({
    url: '/preview/instantFrame',
    method: 'get',
    params: params,
  })
}
