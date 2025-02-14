<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2024-06-12 14:52:45
 * 佛祖保佑没bug
-->
<template>
  <div class="control">
    <div class="control_top">
      <div style="width: calc(100% - 350px)">
        <el-select
          v-model="value"
          placeholder="区域选择"
          size="small"
          @change="changeArea"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in areaOldArray"
            :key="item.areaId"
            :label="'区域：' + item.areaName"
            :value="item.areaId"
          />
        </el-select>
      </div>
      <div style="width: 350px">
        <el-button
          :disabled="areaArray.findIndex((ele: any) => ele.recording) > -1"
          type="primary"
          size="small"
          @click="allStartRecording()"
        >
          所有区域一键开始录制
        </el-button>
        <el-button
          :disabled="!areaRecordingFlag"
          type="danger"
          size="small"
          @click="allEndRecording()"
        >
          所有区域一键结束录制
        </el-button>
      </div>
    </div>
    <div class="control_bottom">
      <div
        class="area_item"
        v-for="(item, index) in areaArray"
        :key="item.areaId"
      >
        <div class="area_top">
          <div style="width: 300px; margin-left: 15px; font-size: 15px">
            {{ '区域：' + item.areaName }}
          </div>
          <div v-if="areaRecordingFlag || item.recording" style="width: 200px">
            {{ item.recordingTime }}
          </div>
          <div style="width: 280px; display: flex; align-items: center">
            <div
              style="display: flex; height: 30px; width: 100px; cursor: pointer"
            >
              <DefSvgIcon
                name="preview-screenshot"
                width="30px"
                height="30px"
              ></DefSvgIcon>
              <span
                style="margin-top: -10px; font-size: 12px"
                @click="preview(item)"
              >
                预览及截图
              </span>
            </div>
            <el-button
              type="primary"
              size="small"
              :disabled="areaRecordingFlag || item.recording"
              @click="startRecording(item, index)"
            >
              开始录制
            </el-button>
            <el-button
              type="danger"
              size="small"
              :disabled="areaRecordingFlag || !item.recording"
              @click="endRecording(item, index)"
            >
              结束录制
            </el-button>
          </div>
        </div>
        <div class="area_bottom">
          <div class="camera">
            <div
              v-for="ite in item.cameras"
              :key="ite.cameraId"
              style="display: flex"
            >
              <div
                class="camera_item"
                v-for="it in ite.channels"
                :key="it.cameraId"
                @click="clickChannel(item, ite, it)"
              >
                <div style="display: flex">
                  <img
                    v-if="it.status === '1'"
                    src="@/assets/images/camera-normal.png"
                    alt=""
                  />
                  <img
                    v-else
                    src="@/assets/images/camera-abnormal.png"
                    alt=""
                  />
                  <div
                    style="
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      text-align: center;
                    "
                    :style="{
                      backgroundColor:
                        it.status === '0'
                          ? '#f9ca26'
                          : it.status === '1' && item.recording
                          ? 'green'
                          : '',
                    }"
                  ></div>
                </div>
                <div style="color: #b6b6b6; font-size: 12px; margin-top: 10px">
                  {{
                    ite.cameraName +
                    ' ' +
                    (it.channelId === 'stream0'
                      ? '左目'
                      : it.channelId === 'stream1'
                      ? '右目'
                      : '')
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="previewModel" class="dialog-mask flex-center">
      <div class="dialog-box">
        <div class="dialog-top">
          <div v-if="!cameraClickFlg">
            <span style="font-size: 12px; margin-right: 3px">相机查看</span>
            <el-select
              v-model="cameraNo"
              placeholder="Select"
              size="small"
              @change="changeCamera"
              style="width: 120px"
            >
              <el-option
                v-for="item in cameraArray"
                :key="item.channelId"
                :label="item.channelName"
                :value="item.channelId"
              />
            </el-select>
          </div>
          <div v-else>
            <span style="font-size: 12px; margin-right: 3px">相机名称</span>
            <span style="font-size: 14px">{{ currentCameraName }}</span>
          </div>
          <div style="width: 230px">{{ nowTime }}</div>
          <div @click="close()" style="cursor: pointer">
            <img src="@/assets/icons/close.svg" alt="" />
          </div>
        </div>
        <div class="dialog-content">
          <video width="600" height="340" :src="mp4Url" autoplay></video>
        </div>
        <div class="dialog-footer" v-if="!cameraClickFlg">
          <el-button
            type="primary"
            size="small"
            @click="screenshot('', '')"
            style="margin-top: 15px"
          >
            <DefSvgIcon
              name="preview-screenshot"
              width="20px"
              height="20px"
            ></DefSvgIcon>
            本相机截图
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="allScreenshot()"
            style="margin-top: 15px"
          >
            <DefSvgIcon
              name="preview-screenshot"
              width="20px"
              height="20px"
            ></DefSvgIcon>
            所有相机截图
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  reqAreaList,
  reqRecordStart,
  reqRecordEnd,
  reqPreviewUrl,
  reqInstantFrame,
  reqRecordStatus,
} from '@/api/control/index'
import { dataURLtoBlob } from '@/utils/download'
import type { AreaResponseData, AreaData } from '@/api/control/type'
import bus from '@/utils/bus'
let value = ref(-1)
let areaArray = ref<any>([]) //区域数组
let areaOldArray = ref<any>([]) //区域数组(一开始的)
let cameraArray: Array<any> = reactive([]) //相机数组
let previewModel = ref(false) //预览弹框标识
let areaId = ref('') //区域标识
let cameraNo = ref('') //相机标识
let areaRecordingFlag = ref(false) //所有区域一键开始录制标识
let cameraClickFlg = ref(false) //区域下方的相机点击标识
let currentCameraName = ref('') //点击区域下方的相机--名称标识
let mp4Url = ref('')
let timer = ref() //区域选择 默认全部-1
let nowTime = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
onMounted(() => {
  // 获取区域列表及相机信息
  getArea()
  // 获取当前时间
  timer.value = setInterval(() => {
    nowTime.value = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    for (let i = 0; i < areaArray.value.length; i++) {
      if (areaArray.value[i].recording) {
        areaArray.value[i].recordingTime = moment(
          moment(new Date()).add(-8, 'h').valueOf() -
            moment(areaArray.value[i].begin).add(-0, 's').valueOf(), //.add(-4, 's')的原因是，bin传过来的begin总是有4s的误差，后续可能有bug
        ).format('HH:mm:ss')
      }
    }
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
/**
 * 区域选择
 * @param areaId 区域Id
 */
const changeArea = (areaId: any) => {
  areaArray.value =
    areaId === -1
      ? areaOldArray.value
      : areaOldArray.value.filter((item: any) => item.areaId === areaId)
}
/**
 * 获取区域列表及相机信息
 */
const getArea = async () => {
  let res: AreaResponseData = await reqAreaList()
  if (res.code === 200000) {
    areaArray.value = res.data
    areaOldArray.value = res.data
    // 获取录像状态
    getRecordStatus()
  }
}
/**
 * 获取录像状态
 */
const getRecordStatus = async () => {
  let res: any = await reqRecordStatus()
  if (res.code === 200000) {
    for (let i = 0; i < areaArray.value.length; i++) {
      for (let j = 0; j < res.data.length; j++) {
        if (areaArray.value[i].areaId === res.data[j].areaId) {
          areaArray.value[i].begin = res.data[j].begin
          areaArray.value[i].recording = res.data[j].recording
        }
      }
    }
  }
}
/**
 * 弹窗改变相机
 * @param channel 相机cameraNo = 相机cameraId + '-' + 通道channelId(左目or右目)
 */
const changeCamera = (channel: string) => {
  cameraNo.value = channel
  let query = {
    areaId: areaId.value,
    cameraId: cameraNo.value.split('-')[0],
    channelId: cameraNo.value.split('-')[1],
  }
  // 获取预览url
  getPreviewUrl(query)
}
/**
 * 关闭弹窗
 */
const close = () => {
  previewModel.value = false
  cameraClickFlg.value = false
}
// 预览及截图
const preview = (param: AreaData) => {
  areaId.value = param.areaId
  cameraArray = []
  param.cameras.forEach((item) => {
    item.channels?.forEach((it) => {
      cameraArray.push({
        channelId: item.cameraId + '-' + it.channelId,
        channelName:
          item.cameraName +
          (it.channelName === 'stream0'
            ? '左目'
            : it.channelName === 'stream1'
            ? '右目'
            : ''),
        status: it.status,
      })
    })
  })
  cameraNo.value = cameraArray[0].channelId
  let query = {
    areaId: areaId.value,
    cameraId: cameraNo.value.split('-')[0],
    channelId: cameraNo.value.split('-')[1],
  }
  // 获取预览url
  getPreviewUrl(query)
  previewModel.value = true
}
/**
 * 获取预览url
 * @param query get url参数，包括
 */
const getPreviewUrl = async (query: object) => {
  console.log(query)
  let res: any = await reqPreviewUrl(query)
  if (res.code === 200000) {
    mp4Url.value = res.data
  }
}
/**
 * 本相机截图
 * @param channel cameraArray[i]中的channelId
 * @param channelName cameraArray[i]中的channelName
 */
const screenshot = async (channel: string, channelName: string) => {
  let query = {
    areaId: areaId.value,
    cameraId: (channel ? channel : cameraNo.value).split('-')[0],
    channelId: (channel ? channel : cameraNo.value).split('-')[1],
  }
  let res: any = await reqInstantFrame(query)
  if (res.code === 200000) {
    downloadFileByBase64(
      res.data,
      channelName ||
        cameraArray.filter((item) => item.channelId === cameraNo.value)[0]
          .channelName,
    )
  }
}
// 所有相机截图
const allScreenshot = async () => {
  for (let i = 0; i < cameraArray.length; i++) {
    screenshot(cameraArray[i].channelId, cameraArray[i].channelName)
  }
}
/**
 * 处理base64并且下载下来
 * @param base64 得到的base64数据
 * @param name 下载下来的名称
 */
const downloadFileByBase64 = (base64: any, name = '相机截图') => {
  base64 = 'data:image/png;base64,' + base64
  let myBlob = dataURLtoBlob(base64)
  let myUrl = URL.createObjectURL(myBlob)
  let a = document.createElement('a')
  a.setAttribute('href', myUrl)
  a.setAttribute('download', name + '.jpg')
  a.click()
  URL.revokeObjectURL(myUrl)
}
/**
 * 开始录制
 * @param item 区域
 * @param index 区域index
 */
const startRecording = async (item: any, index: number) => {
  let res = await reqRecordStart({
    areaId: item.areaId,
    params: {
      limit: 9999999999,
    },
  })
  if (res.code == 200000) {
    // 获取录像状态
    getRecordStatus()
    areaArray.value[index].recording = true
  }
}
/**
 * 结束录制
 * @param item 区域
 * @param index 区域index
 */
const endRecording = async (item: any, index: number) => {
  let res = await reqRecordEnd({
    areaId: item.areaId,
  })
  // 如果录制时间小于1分钟
  if (
    moment('2023-12-07 ' + areaArray.value[index].recordingTime).valueOf() <
    moment('2023-12-07 00:01:00').valueOf()
  ) {
    areaArray.value[index].recording = false
    areaArray.value[index].recordingTime = null
    ElMessage({
      type: 'warning',
      message: '录像时长太短，小于一分钟，未生成录像文件',
    })
    return
  }
  if (res.code == 200000) {
    areaArray.value[index].recording = false
    areaArray.value[index].recordingTime = null
    bus.emit('endRecording') //通知结束录制
  }
}
onBeforeUnmount(() => {
  bus.off('endRecording')
})
/**
 * 所有区域一键开启录制
 */
const allStartRecording = () => {
  areaArray.value.forEach((item: any, index: number) => {
    startRecording(item, index)
  })
  areaRecordingFlag.value = true
}
/**
 * 所有区域一键结束录制
 */
const allEndRecording = () => {
  areaArray.value.forEach((item: any, index: number) => {
    endRecording(item, index)
  })
  areaRecordingFlag.value = false
}
/**
 * 点击相机
 * @param item areaArray[i]
 * @param ite areaArray[i].cameras
 * @param it areaArray[i].cameras[j].channels
 */
const clickChannel = (item: any, ite: any, it: any) => {
  previewModel.value = true
  cameraClickFlg.value = true
  currentCameraName.value =
    ite.cameraName +
    ' ' +
    (it.channelId === 'stream0'
      ? '左目'
      : it.channelId === 'stream1'
      ? '右目'
      : '')
  let query = {
    areaId: item.areaId,
    cameraId: ite.cameraId,
    channelId: it.channelId,
  }
  // 获取预览url
  getPreviewUrl(query)
}
</script>

<style scoped lang="scss">
.control {
  height: 100%;
  background-color: #1d252d;
  padding: 15px;
  .control_top {
    height: 50px;
    line-height: 30px;
    display: flex;
  }
  .control_bottom {
    height: calc(100vh - 150px);
    overflow-y: auto;
    .area_item {
      width: 100%;
      border: 1px solid #01a2ad;
      margin-bottom: 10px;
      .area_top {
        height: 49px;
        line-height: 49px;
        background: linear-gradient(to right, #01a2ad, #1d252d);
        color: #fff;
        display: flex;
        justify-content: space-between;
      }
      .area_bottom {
        .camera {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .camera_item {
            width: 150px;
            height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            img {
              width: 80px;
            }
          }
        }
      }
    }
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .dialog-box {
    background: #101010;
    color: #fff;
    width: 600px;
    border-radius: 5px;
    overflow: hidden;
  }

  .dialog-header {
    padding-top: 20px;
    font-weight: bold;
    text-align: center;
  }

  .dialog-top {
    height: 47px;
    line-height: 47px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    :deep(.el-select .el-input__wrapper) {
      width: 100px;
    }
  }

  .dialog-content {
    background: #101010;
  }

  .dialog-footer {
    height: 57px;
    display: flex;
    align-content: center;
    justify-content: space-around;
  }
  :deep .el-input__wrapper {
    width: 120px !important;
  }
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>
