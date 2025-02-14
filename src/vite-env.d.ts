/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'element-plus'
declare module 'nprogress'
declare module 'element-plus/dist/locale/zh-cn.mjs'

//文件下载
interface doanloadType {
  percentage: number //当前下载进度
  sessionId: string
  state: 'W' | 'D' | '0' | '1' | '2' | '3' | '4' //下载状态：0等待中，1下载中，2下载成功，3取消下载，4下载失败 ,w下载文件准备中,D删除
  fileName: string //文件名
  fileSize: string //'文件大小'
  fileId: string //文件标识
  areaId: string //区域标识
  areaName?: string //区域名称
  begin: string
  end: string
  filePath?: string
  fileDownSize: number
  downLoadTime: string //下载时间
  checked?: Boolean //勾选
}
