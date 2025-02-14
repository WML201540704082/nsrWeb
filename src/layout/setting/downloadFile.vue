<template>
  <div style="position: relative">
    <img
      v-if="!downloadFlg"
      class="download_file_Icon"
      @click="opendownLoadModel"
      src="@/assets/icons/file-download.svg"
      alt=""
    />
    <el-progress
      v-else
      class="download_file_Icon"
      width="25"
      color="#01a2ad"
      stroke-width="1"
      :percentage="percentage"
      type="circle"
    >
      <img
        style="width: 20px; height: 20px"
        @click="opendownLoadModel"
        src="@/assets/icons/file-download.svg"
        alt=""
      />
    </el-progress>

    <!-- 下载动画效果 -->
    <transition name="bounce">
      <img
        v-if="showTransition"
        style="z-index: 9999; position: absolute; right: 0px"
        class="download_file_Icon"
        src="@/assets/icons/file-download.svg"
        alt=""
      />
    </transition>

    <LayLayer
      id="file_layer"
      title="下载列表"
      :type="1"
      :closeBtn="1"
      :maxmin="maxmin"
      :shade="false"
      :area="['482px', '485px']"
      v-model="loadModel"
      :offset="['50px', 'calc(100% - 600px)']"
      @end="LayLayerEnd"
      @close="LayLayerColse"
    >
      <div class="file_downLoad_pannel">
        <div class="file_msg_select">
          <span
            :class="{ selected_background: selected === selectItem.value }"
            v-for="selectItem in selectArr"
            @click="selectChange(selectItem)"
          >
            {{ selectItem.label }}
          </span>
        </div>
        <div class="file_list_pannel">
          <ul v-if="selected === '1'">
            <template v-for="fileItem in downLoadList">
              <li v-if="['0', '1', 'W'].includes(fileItem.state)">
                <el-checkbox
                  :disabled="stopFlg"
                  style="margin-right: 15px; cursor: pointer"
                  v-model="fileItem.checked"
                />
                <div class="file_item_content">
                  <div class="file_item_txt">
                    <img src="@/assets/icons/film.svg" alt="" />
                    <div>
                      <div>
                        <span class="file_name">{{ fileItem.fileName }}</span>
                        <span
                          v-if="['0', 'W'].includes(fileItem.state)"
                          class="file_await"
                        >
                          {{
                            `${
                              '0' === fileItem.state
                                ? '等待下载中'
                                : '下载文件准备中'
                            }...`
                          }}
                        </span>
                      </div>
                      <span class="file_areaMsg">
                        {{ fileAreaMsg(fileItem) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="fileItem.state === '1'" class="file_item_progress">
                    <el-progress
                      v-if="fileItem.state === '1'"
                      class="progress_pannel"
                      :percentage="fileItem.percentage"
                      color="#7AC756"
                    />
                    <el-icon
                      class="file_control"
                      @click="stopOneDownload(fileItem)"
                    >
                      <CircleClose />
                    </el-icon>
                  </div>
                </div>
              </li>
            </template>
          </ul>
          <ul v-else-if="selected === '2'">
            <template v-for="fileItem in downLoadList">
              <li
                v-if="fileItem.state === '2'"
                :key="fileItem.fileId"
                style="margin-bottom: 15px"
              >
                <el-checkbox
                  style="margin-right: 15px"
                  v-model="fileItem.checked"
                />
                <div class="file_item_content">
                  <div class="file_item_txt">
                    <img src="@/assets/icons/film.svg" alt="" />
                    <div style="margin-left: 10px">
                      <span style="margin-bottom: 5px">
                        {{ fileItem.fileName }}
                      </span>
                      <span style="margin-bottom: 2px" class="file_areaMsg">
                        {{ fileAreaMsg(fileItem) }}
                      </span>
                      <div>
                        <span style="padding-right: 4px">
                          {{ `${fileItem.downLoadTime} 下载完成` }}
                        </span>
                        <img src="@/assets/icons/successFile.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
          <!-- <ul v-else-if="selected === '3'">
            <template v-for="fileItem in downLoadList">
              <li v-if="['3', '4'].includes(fileItem.state)">
                <el-checkbox style="margin-right: 15px" :v-model="fileItem.checked" />
                <span class="file_name">{{ fileItem.fileName }}</span>
                <span class="progress_pannel">
                  {{ fileItem.state === '3' ? '已取消下载' : '下载失败' }}
                </span>
              </li>
            </template>
          </ul> -->
        </div>
        <div class="file_download_bottom">
          <template v-if="selected === '1'">
            <div style="flex: 1; margin-left: 15px">
              <el-checkbox :disabled="stopFlg" @change="changeAll" />
            </div>
            <span
              v-if="stopFlg"
              class="file_download_button"
              @click="downAbort"
            >
              确认取消？
            </span>
            <span
              v-if="stopFlg"
              class="file_download_button"
              @click="stopFlg = false"
            >
              放弃取消
            </span>

            <span class="file_download_button" @click="cancelDownload">
              <el-button
                v-if="stopFlg"
                loading
                style="width: 100%; height: 100%"
                type="info"
                :icon="Download"
                circle
              />
              {{ stopFlg ? '' : '取消下载' }}
            </span>
          </template>
          <template v-else-if="selected === '2'">
            <div style="flex: 1; margin-left: 15px">
              <el-checkbox @change="changeDelAll" />
            </div>
            <span class="file_download_button" @click="deleteDownList">
              删除记录
            </span>
          </template>
        </div>
      </div>
    </LayLayer>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  ref,
  toRef,
  onMounted,
  computed,
  onUnmounted,
  watch,
  nextTick,
} from 'vue'
import { Download, Delete } from '@element-plus/icons-vue'
import { LayLayer } from '@layui/layer-vue'
import type { Ref } from 'vue'
import bus from '@/utils/bus'
import fileApi from '@/api/file/index'
import { fileAreaReqType } from '@/api/file/type'
import useUserStore from '@/store/modules/user'
import moment from 'moment'
import { guid } from '@/utils/guid'
import { transformSize } from '@/utils/index'

const max = 100
const format = 'YYYY-MM-DD HH:mm:ss'
const props = defineProps({
  maxmin: {
    type: Boolean,
    default: false,
  },
})
let userStore = useUserStore()
const downLoadList = toRef(userStore, 'downLoadList') //下载文件的所有信息

const stopFlg = ref(false) //控制确认取消按钮
const showTransition = ref(false) //控制下载动画
const downloadFlg = ref(false) //下载标志
const percentage = computed(() => {
  //当前下载进度
  let obj = downLoadList.value.find((it) => it.state === '1')
  return obj?.percentage || 0
})

interface readType {
  value: any
  done: boolean
}
//state: '0' | '1' | '2' | '3' | '4' //下载状态：0等待中，1下载中，2下载成功，3取消下载，4下载失败 ,D已删除 ，W文件生成中
const selectArr = reactive(
  Object.freeze([
    { value: '1', label: '正在下载' },
    // { value: '3', label: '下载失败' },
    { value: '2', label: '下载完成' },
  ]),
)
const selected: Ref<String> = ref('1') //当前展示信息
const selectChange = (selectItem: { value: String; label: String }) => {
  selected.value = selectItem.value
}

//layyer所需字段与事件
const loadModel: Ref<Boolean> = ref(false)
const opendownLoadModel = () => {
  loadModel.value = true
  nextTick(() => {
    //删除关闭按钮a标签的href属性，来去除鼠标放在关闭按钮时左下角显示的javascript:;
    let link: HTMLCollectionOf<Element> =
      document.getElementsByClassName('layui-layer-close')
    if (link.length > 0) {
      link[0].removeAttribute('href')
    }
  })
}
const LayLayerEnd = () => {
  console.log('LayLayerEnd 销毁回调')
}
const LayLayerColse = () => {
  console.log('LayLayerColse 关闭回调')
}

const startFlg = ref(false) // 循环请求文件标志
onMounted(() => {
  //录像文件页面通知取消下载
  bus.on('stopFileDownload', async (sessionId: string) => {
    let stopList = downLoadList.value.filter((it) => it.sessionId === sessionId) //查找该区域的下载列表
    for (let fileItem of stopList) {
      stopOneDownload(fileItem) //调用单条取消逻辑
      // if (fileItem.state === '1') {
      //   //正在下载的取消下载
      //   downAbortFun && (await downAbortFun())
      //   fileItem.state = '3'
      // } else if (fileItem.state === '0') {
      //   //等待队列的直接改为已取消下载
      //   fileItem.state = '3'
      // }
    }
    // getFileInfoAndDownload() //开始队列的其他下载任务
  })

  //文件下载开始
  bus.on('downloadStart', () => {
    showTransition.value = true //开启下载动画
    setTimeout(() => {
      showTransition.value = false //关闭下载动画
    }, 500)
    getFileInfoAndDownload() //开始下载
    downloadFlg.value = true
  })
})

onUnmounted(async () => {
  timer && clearTimeout(timer)
  //页面刷新和退出时，将取消所有下载并将其设置为取消下载，并保存所有下载信息供查询，后续考虑最多保留最近多少条的数据,目前保留最新的100条下载成功的记录
  for (let fileItem of downLoadList.value) {
    if (fileItem.state === '1') {
      //正在下载的取消下载
      downAbortFun && (await downAbortFun())
      fileItem.state = '3'
    } else if (fileItem.state === '0') {
      //等待队列的直接改为已取消下载
      fileItem.state = '3'
    } else {
      continue
    }
  }
  updateLocalStorage()
})

//浏览器保存下载成功信息
const updateLocalStorage = () => {
  let successList = downLoadList.value.filter((it) => it.state === '2')
  window.localStorage.setItem(
    'downloadFileItem',
    JSON.stringify(successList.slice(-max)),
  )
}

// 获取文件信息并下载
const getFileInfoAndDownload = async () => {
  //更新浏览器保存的信息
  updateLocalStorage()

  //生成文件准备
  await reqDownloadFile()

  //判断是否存在正在下载文件，不存在开始下载，存在等待
  let obj = downLoadList.value.find((it) => it.state === '1')
  if (obj) return

  let objFile = downLoadList.value.find((it) => it.state === 'W') //查找已请求生成下载文件的数据
  if (!objFile) {
    downloadFlg.value = false
    startFlg.value = false
    console.log('队列文件已全部处理完毕！')
    return
  }
  if (startFlg.value === true) return //代表有正在准备下载的文件，等待
  if (objFile.filePath) {
    startDownloadFile(objFile.fileId)
  } else {
    startFlg.value = true
    getfileStatus(objFile.sessionId, objFile.fileId)
    console.log('start getfileStatus', objFile.fileId)
  }
}

//查找已请求下载的文件，如果没有请求下载文件
const reqDownloadFile = async () => {
  //判断有多少文件已请求下载生成下载文件，同时存在最多两个 （目前服务器同一时间只会执行一条）
  let waitList = downLoadList.value.filter((it) => it.state === 'W')
  if (waitList.length < 1) {
    let addItem = downLoadList.value.find((it) => it.state === '0')
    if (!addItem) return
    let stateRes = await fileApi.fileAreaStatus({
      sessionId: addItem.sessionId,
    }) //文件状态请求查询
    if (stateRes.data.status === '1' || stateRes.data.status === '0') {
      //已请求下载文件中
    } else if (stateRes.data.status === '2') {
      //已生成对应下载文件
      addItem.fileSize = stateRes.data.fileSize
      addItem.filePath = stateRes.data.fileName
    } else {
      //其他，请求生成下载文件
      //请求区域文件下载参数
      let fileAreaData: fileAreaReqType = {
        areaId: addItem.areaId,
        begin: addItem.begin,
        end: addItem.end, //结束时间
        urlCallback: '', //http回调地址
        sessionId: addItem.sessionId,
      }
      let res = await fileApi.fileArea(fileAreaData) //请求下载文件
    }
    addItem.state = 'W'
    await reqDownloadFile()
  }
}

let timer: any = null
let currentTimerId: any = null //当前循环查询文件状态的文件id
let errorCnt = 0 //考虑程序执行错误时尝试继续执行次数，超过三次判定为下载失败（暂未做）
const getfileStatus = async (sessionId: string, fileId: string) => {
  try {
    currentTimerId = fileId
    let stateRes = await fileApi.fileAreaStatus({ sessionId }) //文件状态请求查询
    if (stateRes?.data) {
      let updateItem = downLoadList.value.find((it) => it.fileId === fileId)
      switch (stateRes.data.status) {
        case '1':
          timer = setTimeout(async () => {
            getfileStatus(sessionId, fileId) //文件生成中，5秒后继续查询
          }, 5000)
          break
        case '0':
          timer = setTimeout(async () => {
            getfileStatus(sessionId, fileId) //文件还在等待生成队列中30秒后继续查询
          }, 30000)
          break
        case '2':
          if (updateItem) {
            updateItem.fileSize = stateRes.data.fileSize
            updateItem.filePath = stateRes.data.fileName
            currentTimerId = null
            startDownloadFile(fileId) //文件已生成，执行下载
          } else {
            ElMessage({
              type: 'error',
              message: '数据处理错误，下载失败！继续下载下一条数据',
            })
            startFlg.value = false
            getFileInfoAndDownload()
          }
          break
        default:
          ElMessage({
            type: 'error',
            message: '文件生成失败！继续下载下一条数据',
          })
          updateItem && (updateItem.state = '4')
          startFlg.value = false
          getFileInfoAndDownload()
          break
      }
    }
  } catch (error) {
    console.log('程序执行错误：', error)
    startFlg.value = false
    let Item = downLoadList.value.find((it) => it.fileId === fileId)
    Item && (Item.state = '4')
    getFileInfoAndDownload()
  }
}

//开始下载
const startDownloadFile = (fileId: String) => {
  let objFile = downLoadList.value.find(
    (it) => it.fileId === fileId && it.state === 'W',
  )
  if (!objFile) {
    return
  }
  if (!objFile.filePath) {
    ElMessage({
      type: 'warning',
      message: '当前文件无下载路径，下载失败，继续执行下载下一个文件',
    })
    objFile.state = '4'
    startFlg.value = false
    getFileInfoAndDownload()
    return
  }
  // 远程下载
  objFile.state = '1' //开始下载
  reqDownloadFile() //准备生成下一条下载文件
  const logProgress = (res: any) => {
    const [progressStream, returnStream] = res.body.tee()
    const reader = progressStream.getReader()
    const log = () => {
      reader.read().then((readRes: readType) => {
        if (!objFile) {
          return
        }
        if (readRes.done) {
          //下载成功
          return
        }
        objFile.fileDownSize += readRes.value.length
        if (objFile.state == '1') {
          objFile.percentage =
            (objFile.fileDownSize / Number(objFile.fileSize)) * 100 <= 100
              ? Number(
                  Number(
                    (objFile.fileDownSize / Number(objFile.fileSize)) * 100,
                  ).toFixed(0),
                )
              : 100
        }
        log()
      })
    }
    log()
    return new Response(returnStream, { headers: res.headers })
  }
  console.log('xxxfilePath', objFile.filePath)
  fetch(objFile.filePath, {
    method: 'GET',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json;application/octet-stream' },
    // credentials: 'include', // 允许携带cookie
  })
    .then(abortHandler)
    .then(logProgress)
    .then((res) => res.blob())
    .then((blob) => {
      if (blob.size === 0) {
        objFile && (objFile.state = '4')
        ElMessage({
          type: 'warning',
          message: '请求错误，下载失败，继续执行下载下一个文件',
        })
        startFlg.value = false
        getFileInfoAndDownload()
      } else {
        if (!objFile) {
          ElMessage({
            type: 'error',
            message: '数据错误！',
          })
          return
        }
        if (objFile.state === '3') {
          console.log('取消下载成功:,fileid is:', objFile.fileId)
          startFlg.value = false
          getFileInfoAndDownload()
          return
        }
        objFile.state = '2'
        objFile.downLoadTime = moment(new Date()).format(format)
        startFlg.value = false
        getFileInfoAndDownload()
        let u = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.download = objFile?.fileName || '文件下载'
        a.href = u
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        updateLocalStorage()
      }
    })
    .catch((err) => {
      console.log('err', err)
      objFile && (objFile.state = '4')
      ElMessage({
        type: 'warning',
        message: '请求错误，下载失败，继续执行下载下一个文件',
      })
      startFlg.value = false
      getFileInfoAndDownload()
    })
}

let downAbortFun: any = null
const abortHandler = (res: any) => {
  const reader = res.body.getReader()
  const stream = new ReadableStream({
    start(controller) {
      let aborted = false
      const push = () => {
        reader.read().then((readRes: readType) => {
          if (readRes.done) {
            if (!aborted) controller.close()
            return
          }
          controller.enqueue(readRes.value)
          push()
        })
      }
      downAbortFun = async () => {
        await reader.cancel()
        aborted = true
      }
      push()
    },
  })
  return new Response(stream, { headers: res.headers })
}

//删除下载记录
const deleteDownList = () => {
  let delList = downLoadList.value.filter(
    (it) => it.state === '2' && it.checked,
  )
  if (delList.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择要删除的记录！',
    })
    return
  }
  for (let delItem of delList) {
    let index = downLoadList.value.findIndex(
      (it) => it.fileId === delItem.fileId,
    )
    if (index > -1) {
      downLoadList.value.splice(index, 1)
    }
  }
  updateLocalStorage()
}

//取消下载
const cancelDownload = () => {
  let stopList = downLoadList.value.filter(
    (it) => it.checked === true && ['1', '0', 'W'].includes(it.state),
  )
  if (stopList.length === 0) {
    ElMessage({
      showClose: true,
      message: '请勾选至少一条数据！',
      type: 'warning',
    })
    return
  }
  stopFlg.value = true
}
//取消一条
const stopOneDownload = async (fileItem: doanloadType) => {
  if (fileItem.state === '1') {
    downAbortFun && (await downAbortFun())
    startFlg.value = false
  } else if (fileItem.state === 'W' && fileItem.fileId === currentTimerId) {
    timer && clearTimeout(timer) //清除正在循环查询的定时器
    startFlg.value = false
  }
  fileItem.state = '3'
  getFileInfoAndDownload()
}

//区域+时间段+文件大小描述格式化
const fileAreaMsg = (fileItem: doanloadType) => {
  return `${fileItem.areaName} ${fileItem.begin.substring(
    0,
    10,
  )}(${fileItem.begin.substring(11)} - 
  ${fileItem.end.substring(11)}) ${transformSize(fileItem.fileSize)}`
}

//勾选全部暂停文件
const changeAll = (e: boolean) => {
  for (let item of downLoadList.value.filter((it) =>
    ['0', '1', 'W'].includes(it.state),
  )) {
    item.checked = e
  }
}

//全选删除文件
const changeDelAll = (e: boolean) => {
  for (let item of downLoadList.value.filter((it) => it.state === '2')) {
    item.checked = e
  }
}

//批量取消
const downAbort = async () => {
  stopFlg.value = false
  let stopList = downLoadList.value.filter(
    (it) => it.checked === true && ['1', '0', 'W'].includes(it.state),
  )
  for (let stopItem of stopList) {
    if (stopItem.state === '1') {
      downAbortFun && (await downAbortFun())
    } else if (stopItem.state === 'W' && stopItem.fileId === currentTimerId) {
      timer && clearTimeout(timer) //清除正在循环查询的定时器
      startFlg.value = false
    }
    stopItem.state = '3'
    stopItem.fileDownSize = 0
  }
  console.log(downLoadList.value, stopList)
  ElMessage({
    showClose: true,
    message: '取消成功',
    type: 'success',
  })
  getFileInfoAndDownload()
}
</script>
<style lang="scss" scoped>
.download_file_Icon {
  cursor: pointer;
  margin-right: 20px;

  :deep(.el-progress__text) {
    left: -12px;
  }
}

.file_downLoad_pannel {
  margin-top: 10px;
  height: 418px;
  position: relative;

  .file_msg_select {
    display: flex;
    height: 32px;
    border-radius: 4px;
    border: 1px solid rgba(22, 132, 252, 1);

    .selected_background {
      background-color: #32a0aa;
    }

    > * {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .file_list_pannel {
    --el-checkbox-checked-bg-color: #409eff; //勾选框灰显时的背景颜色
    --el-border-color-extra-light: #409eff;
    height: calc(418px - 32px - 36px);
    overflow: auto;

    > ul {
      margin: 0 5px 0 10px;
      color: #fff;
      font-size: 12px;
      font-family: SourceHanSansSC-regular;

      > li {
        display: flex;
        align-items: center;
        margin: 5px 0px;

        .file_item_content {
          display: flex;
          flex: 1;
          flex-direction: column;

          .file_item_txt {
            display: flex;

            > :last-child {
              display: flex;
              flex-direction: column;
              font-size: 12px;

              > :first-child {
                display: flex;

                .file_await {
                  flex: 1;
                  text-align: right;
                }
              }
            }
          }

          .file_item_progress {
            display: flex;
          }
        }

        .file_control {
          margin-right: 15px;
          color: #f5222d;
          cursor: pointer;
        }

        .file_areaMsg {
          height: 17px;
          color: rgba(161, 161, 161, 1);
        }

        .file_name {
          height: 20px;
          min-width: 20%;
        }

        .progress_pannel {
          // margin: 0 0 0 15px;
          // text-align: center;
          flex: 1;

          :deep(.el-progress__text) {
            --el-text-color-regular: #7ac756;
            min-width: 30px;
          }
        }
      }
    }
  }

  .file_download_bottom {
    display: flex;
    align-items: center;
    border-top: 1px solid #bbbbbb;

    .file_download_button {
      margin: 5px 16px 0 0;
      font-size: 12px;
      font-family: Microsoft Yahei;
      border: 1px solid rgba(229, 82, 37, 1);
      color: #fff;
      width: 85px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .file_download_button:hover {
      background-color: #a89898;
    }
  }
}
</style>

<!-- 下载等弹出框样式调整 -->
<style lang="scss">
.layui-layer {
  background-color: rgba(51, 63, 72, 1) !important;
  color: #fff !important;
  border: 1px solid #01a2ad;

  .layui-layer-title {
    font-size: 14px;
    color: #fff !important;
  }

  .layui-layer-max {
    display: none;
  }

  .layui-layer-setwin {
    .layui-layer-min cite {
      background-color: #c0bfbf;
    }

    .layui-layer-ico {
      background-color: #c0bfbf;
    }

    .layui-layer-max {
      display: none;
      background-color: #c0bfbf;
    }

    .layui-layer-close {
      background: url('@/assets/images/colse.png') 100% 100%;
    }
  }
}
</style>

<style lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

// .bounce-leave-active {
//   animation: bounce-in 0.5s reverse;
// }

@keyframes bounce-in {
  0% {
    transform: translateY(200px);
  }

  // 50% {
  //   transform: translateY(100px);
  // }

  100% {
    transform: translateY(0px);
  }
}
</style>
