//查询展示列表
interface fileListType {
  id: string //唯一标识
  idx?: number //序列号,从1开始
  areaId: string //区域id或相机id
  begin: string
  end: string
  isArea?: boolean //是否为区域
  name?: string // 区域名称
  camera?: string //相机名称
  fileSize: string | number
  download?: boolean
  channels?: fileChannelType[]
  fileMSg?: string
  children?: fileListType[]
}

//上一次离开页面前的数据
interface fileDataType {
  areaDateModel?: any
  areaMenuModel?: any
  cameraModel?: any
}

//相机区域列表查询
interface fileAreaType {
  areaId: string //区域标识
  begin: string
  end: string
  fileSize?: string | number
  areaName?: string | null //区域名称
  cameras: fileCameraType[]
}

interface fileCameraType {
  cameraId: string //相机id
  fileSize?: string | number
  cameraName?: string //相机名称
  protocol?: string | null //协议
  channels?: fileChannelType[]
}
interface fileChannelType {
  channelId: string //通道id
  channelName?: string //通道名称
  status?: '1' | '0' //0 - 离线，1 - 在线
  channelType?: string //类型
}

interface fileAreaResType {
  areaId: string //区域标识
  begin: string //开始时间
  end: string //结束时间 必需
  status: string //状态 必需 0-初始，1-生成中，2-成功，3-失败
  fileSize: string
  fileName: string
  sessionId: string
  fileList?: fileType[] //文件列表
}
interface fileType {
  fileName: string //文件名称
  fileSize: string //文件大小
  sessionId?: string //会话号
}

//相机区域及通道 areaMenu
interface areaMenuType {
  areaId: string //区域标识
  isLeaf?: boolean //子元素是否展开
  checked?: boolean //是否勾选
  areaName: string //区域名称
  cameras: Array<cameraType>
}
interface cameraType {
  cameraId: string //相机id
  checked?: boolean //是否勾选
  cameraName: string | null //相机名称
  protocol?: string | null //协议
  channels?: Array<channelType> | null
}
interface channelType {
  channelId: string //通道id
  checked?: boolean //是否勾选
  channelName: string //通道名称
  status: '1' | '0' //0 - 离线，1 - 在线
  channelType: string //类型
}
