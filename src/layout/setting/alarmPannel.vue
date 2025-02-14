<template>
  <div style="position: relative">
    <img
      v-if="alarmList.length > 0"
      class="download_file_Icon"
      @click="opendownLoadModel"
      src="@/assets/icons/iconPark-alarm.svg"
      alt=""
    />
    <img
      v-else
      class="download_file_Icon"
      @click="opendownLoadModel"
      src="@/assets/icons/iconPark-alarm0.svg"
      alt=""
    />
    <span
      v-if="false"
      style="
        position: absolute;
        right: 10px;
        color: red;
        border-radius: 50%;
        font-size: 12px;
        border: 1px solid red;
      "
    >
      {{ alarmList.length }}
    </span>
  </div>
  <LayLayer
    id="file_layer"
    title="预警"
    :type="1"
    :closeBtn="1"
    :maxmin="maxmin"
    :shade="false"
    :area="['409px', '485px']"
    v-model="loadModel"
    :offset="['50px', 'calc(100% - 580px)']"
    @end="LayLayerEnd"
    @close="LayLayerColse"
  >
    <div class="file_downLoad_pannel">
      <ul>
        <li v-for="alarm in alarmList" :key="alarm.type">
          <template v-if="alarm.type === 'alarm'">
            <div>
              <div class="alarm_top">
                <span>{{ alarm.title }}</span>
                <span>{{ alarm.date }}</span>
              </div>
              <div class="alarm_centent">
                <div>
                  <div
                    class="alarm_centent_use"
                    :style="{
                      width: `${(alarm.use / alarm.total) * 276}px`,
                      background: '#FF4D4F',
                    }"
                  >
                    <span>
                      {{ `${Math.floor((alarm.use * 100) / alarm.total)}%` }}
                    </span>
                  </div>
                </div>
                <div>
                  <el-button text @click="handleOnClick">处理</el-button>
                </div>
              </div>
              <div class="alarm_top">
                <span>
                  {{
                    `已经使用${transformSize(alarm.use)} / 剩余${transformSize(
                      alarm.total - alarm.use,
                    )}`
                  }}
                </span>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </LayLayer>

  <!-- 告警弹出提示 -->
  <el-dialog
    title="存储空间不足预警"
    :close-on-click-modal="false"
    :model-value="
      Math.floor((spaceMsg.used / spaceMsg.total) * 100) >= alarmNumber &&
      diskWarning
    "
    :before-close="handleClose"
    :width="790"
    top="168px"
    style="
      --el-dialog-bg-color: #333f48;
      --el-text-color-primary: #fff;
      --el-color-info: #fff;
    "
  >
    <div class="disk_warning_body">
      <div class="disk_top_text">
        <span>NSR存储空间查看</span>
        <span>{{ `共${transformSize(spaceMsg.total)}` }}</span>
      </div>
      <div class="disk_space_pannel">
        <div
          :style="{
            width: `${Math.floor((spaceMsg.used * 100) / spaceMsg.total)}%`,
          }"
        >
          <span>
            {{ `${Math.floor((spaceMsg.used * 100) / spaceMsg.total)}%` }}
          </span>
        </div>
        <div style="flex: 1"></div>
      </div>
      <div class="disk_bottom_text">
        <span>
          {{
            `已经使用${transformSize(spaceMsg.used)} / 剩余${transformSize(
              spaceMsg.residue,
            )}`
          }}
        </span>
      </div>
    </div>
    <template v-slot:footer>
      <div class="disk_warning_footer">
        <el-button type="primary" @click="handleConfirm">处理</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {
  reactive,
  ref,
  toRef,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from 'vue'
import { LayLayer } from '@layui/layer-vue'
import type { Ref } from 'vue'
import bus from '@/utils/bus'
import { transformSize } from '@/utils/index'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
import moment from 'moment'
const alarmNumber = 90 //内存告警值
const router = useRouter()
let userStore = useUserStore()
const alarmList = toRef(userStore, 'alarmList') //下载文件的所有信息

const props = defineProps({
  maxmin: {
    type: Boolean,
    default: false,
  },
})

//磁盘信息
const spaceMsg = reactive({
  used: 0, //已使用
  total: 0, //总共
  residue: 0, // 剩余
})

const diskWarning = ref(false) //是否自动弹出告警
onMounted(() => {
  startWebSocket()
})
onUnmounted(() => {
  errTimeOut && clearTimeout(errTimeOut) //清除定时器
  ws && ws.close() //关闭WebSocket
})

////使用webscoket
let ws: any = null
let errTimeOut: any = null //定时重新连接
let errcnt: number = 0 //统计连接次数
const startWebSocket = () => {
  const token = userStore.token
  let hs = import.meta.env.VITE_WS_BASE_URL
    ? import.meta.env.VITE_WS_BASE_URL
    : `ws://${window.location.host}`
  ws = new WebSocket(`${hs}/api/web/notify?Authorization=${token}`)
  ws.onopen = function () {
    console.log('握手成功')
  }
  ws.onmessage = function (e: any) {
    const { data, code } = JSON.parse(e.data)
    if (code == 403301) {
      console.log('updateSpaceMsg start!')
      updateSpaceMsg(data)
    }
  }
  ws.onerror = function (err: any) {
    if (errcnt > 4) {
      console.log('WebSocket 已超过重新连接次数！')
      return
    }
    errTimeOut = setTimeout(() => {
      // 错误断开3s后重连
      errcnt++
      startWebSocket()
    }, 3000)
    console.log('WebSocket 连接错误 ,date is:' + new Date())
  }
  ws.onclose = function () {
    console.log('连接关闭')
  }
}

//更新磁盘警告信息
const updateSpaceMsg = (msg: {
  total: number
  used: number
  limit?: number
}) => {
  spaceMsg.total = msg.total
  spaceMsg.used = msg.used
  spaceMsg.residue = msg.total - msg.used
  let index = alarmList.value.findIndex((it) => it.type === 'alarm')
  if (index > -1) {
    diskWarning.value = false
    //如果告警信息已存储，如果使用率超过 alarmNumber，更新告警信息，如果没有超过删除告警信息
    if ((msg.used * 100) / msg.total >= alarmNumber) {
      alarmList.value[index].total = msg.total
      alarmList.value[index].use = msg.used
    } else {
      alarmList.value.splice(index, 1) //删除告警信息
    }
  } else {
    diskWarning.value = true
  }
}

const handleConfirm = () => {
  handleClose()
  router.push({ path: '/system/storageMana' })
}
const handleClose = () => {
  diskWarning.value = false
  let obj = {
    type: 'alarm',
    title: '存储空间不足预警',
    date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    use: spaceMsg.used,
    total: spaceMsg.total,
  }
  alarmList.value.push(obj)
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

const handleOnClick = () => {
  router.push({ path: '/system/storageMana' })
  loadModel.value = false
}
</script>
<style lang="scss" scoped>
.download_file_Icon {
  cursor: pointer;
  margin-right: 20px;
}

.file_downLoad_pannel {
  // margin-top: 10px;
  height: 418px;
  overflow: auto;
  font-size: 12px;
  font-family: SourceHanSansSC-regular;

  > ul {
    > li {
      margin-left: 20px;

      .alarm_top {
        height: 34px;
        display: flex;
        align-items: center;

        > * {
          flex: 1;
        }
      }

      .alarm_centent {
        height: 30px;
        display: flex;

        .alarm_centent_use {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        > :first-child {
          height: 100%;
          border-radius: 7px;
          width: 276px;
          background-color: #a9a9a9;

          > * {
            border-radius: 7px;
            height: 100%;
          }
        }

        > :last-child {
          flex: 1;
          display: flex;
          justify-content: right;

          > button {
            margin-right: 12px;
            border-radius: 4px;
            color: rgba(255, 255, 255, 1);
            font-size: 14px;
            text-align: center;
            font-family: Microsoft Yahei;
            border: 1px solid rgba(1, 162, 173, 1);
            --el-fill-color-light: #817b7b; //点击后的背景颜色
          }

          > button:hover {
            background-color: #817b7b;
          }
        }
      }
    }
  }
}

.disk_warning_body {
  width: 100%;
  color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;

  .disk_top_text {
    display: flex;
    height: 20px;
    align-items: center;
    justify-content: space-between;
    margin-right: 10%;
  }

  .disk_bottom_text {
    display: flex;
    flex-direction: row-reverse;
    margin-right: 10%;
  }

  .disk_space_pannel {
    margin: 18px 0;
    width: 100;
    height: 51px;
    border-radius: 7px;
    display: flex;
    background-color: #a9a9a9;

    > :first-child {
      border-radius: 7px;
      background-color: rgba(255, 77, 79, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.disk_warning_footer {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-dialog__header) {
  font-family: SourceHanSansSC-regular;
}

:deep(.el-dialog__body) {
  border-top: 1px solid #bbb;
  // min-height: 200px;
  font-family: SourceHanSansSC-regular;
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
