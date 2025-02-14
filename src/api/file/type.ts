export interface getFileInfoType {
  id?: string
  sessionID?: string
  fileId?: string
  fileName?: string
}

export interface areaListReqType {
  begin: string
  end: string
  areaId: string[]
}

// export interface fileAreaType1 {
//   areaId: string //区域标识
//   begin: string //开始时间
//   end: string //结束时间 必需
//   status: string //状态 必需 0-初始，1-生成中，2-成功，3-失败
//   fileList: fileListType[] //文件列表
// }
// interface fileListType {
//   fileName: string//文件名称
//   fileSize: string //文件大小
//   sessionId: string//会话号
// }
export interface fileAreaReqType {
  areaId: string //区域标识
  begin: string
  end: string //结束时间
  urlCallback?: string //http回调地址
  sessionId: string //会话号
}
