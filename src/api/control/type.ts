/*
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-23 14:12:51
 * @LastEditors: wml
 * @LastEditTime: 2023-11-23 19:36:32
 * 佛祖保佑没bug
 */
export interface ResponseData {
  code: number
  message: string
}

export interface channel {
  channelId?: string
  channelName?: string
  status?: string //状态 0-离线，1-在线
  channelType?: string
}

export interface camera {
  cameraId?: string //相机标识
  cameraName?: string //相机名称
  protocol?: string //协议
  channels?: channel[]
}

export interface AreaData {
  areaId: string
  areaName: string
  cameras: camera[]
}

export interface AreaResponseData extends ResponseData {
  data: AreaData
}

export interface RecordStartData {
  areaId: string
  params: object
}

export interface RecordEndData {
  areaId: string
}
