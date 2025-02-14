<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-06 19:23:47
 * 佛祖保佑没bug
-->
<template>
  <div class="storage-mana">
    <div class="storage-con">
      <el-col v-for="(item, index) in storageList" :key="index">
        <div class="storage-title">
          <span class="title-left">NSR存储空间</span>
          <span class="title-right">共 {{ item.totalStorage }} GB</span>
        </div>
        <el-progress :stroke-width="24" :percentage="usedProgress" />
        <span class="storage-details">
          已使用 {{ item.usedStorage }} GB / 剩余 {{ item.remainStorage }} GB
        </span>
      </el-col>
    </div>
    <div class="clear-con">
      <span class="clear-title">快速清理空间</span>
      <div class="check-time">
        <span class="check-title">选择清理日期</span>
        <el-date-picker
          v-if="isAutoTime"
          v-model="autoTime"
          @change="changeAutoTime"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
        ></el-date-picker>
        <el-select
          v-model="checkTime"
          @change="changeCheckTime"
          v-else
          size="small"
        >
          <el-option
            v-for="{ value, label } in timeList"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
        <div class="auto">
          <span class="auto-title">自定义日期</span>
          <el-switch size="small" v-model="isAutoTime" />
        </div>
      </div>
      <div class="clear-time">
        <span class="title">已选清除日期</span>
        <span class="details" v-if="startTime === endTime">
          {{ startTime }}
        </span>
        <span class="details" v-else>{{ startTime }} 至 {{ endTime }}</span>
      </div>
      <div class="clear-button">
        <el-button type="info" @click="onReset">重置</el-button>
        <el-button type="danger" class="danger-button" @click="onShowDialog">
          删除
        </el-button>
      </div>
    </div>
    <el-dialog
      v-model="isShowDialog"
      title="提示"
      width="315"
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="dg-dialog__warning">确认删除已选日期的录像？</div>
      <template #footer>
        <div class="dg-dialog__footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onDelete">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  queryRecordStorage,
  deleteRecordStorage,
} from '@/api/system/storageMana'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const checkTime = ref('30')
const isAutoTime = ref(false)
const autoTime = ref('')
const startTime = ref(
  moment(new Date()).add(-30, 'days').format('YYYY年MM月DD日'),
)
const endTime = ref(moment(new Date()).add(-1, 'days').format('YYYY年MM月DD日'))
let storageList = ref([
  {
    usedStorage: 0,
    totalStorage: 0,
    remainStorage: 0,
  },
])
const timeList = ref([
  {
    label: '前30天',
    value: '30',
  },
  {
    label: '前15天',
    value: '15',
  },
  {
    label: '前10天',
    value: '10',
  },
  {
    label: '前3天',
    value: '3',
  },
  {
    label: '今天',
    value: '0',
  },
])
let param = ref({
  startDate: moment(new Date()).add(-30, 'days').format('YYYY-MM-DDT00:00:00Z'),
  endDate: moment(new Date()).add(-1, 'days').format('YYYY-MM-DDT23:59:59Z'),
})
const changeCheckTime = (e: string) => {
  startTime.value = moment(new Date())
    .subtract(e, 'days')
    .format('YYYY年MM月DD日')
  param.value.startDate = moment(new Date())
    .subtract(e, 'days')
    .format('YYYY-MM-DDT00:00:00Z')
  if (e === '0') {
    endTime.value = moment(new Date()).format('YYYY年MM月DD日')
    param.value.endDate = moment(new Date()).format('YYYY-MM-DDT23:59:59Z')
  } else {
    endTime.value = moment(new Date()).add(-1, 'days').format('YYYY年MM月DD日')
    param.value.endDate = moment(new Date())
      .add(-1, 'days')
      .format('YYYY-MM-DDT23:59:59Z')
  }
}
const changeAutoTime = (e: any) => {
  startTime.value = moment(e[0]).format('YYYY年MM月DD日')
  endTime.value = moment(e[1]).format('YYYY年MM月DD日')
  param.value.startDate = moment(e[0])
    .add(8, 'hours')
    .format('YYYY-MM-DDT00:00:00Z')
  param.value.endDate = moment(e[1])
    .add(8, 'hours')
    .format('YYYY-MM-DDT23:59:59Z')
}
const onReset = () => {
  console.log('点击重置按钮')
  isAutoTime.value = false
  checkTime.value = '30'
  autoTime.value = ''
  startTime.value = moment(new Date()).add(-30, 'days').format('YYYY年MM月DD日')
  endTime.value = moment(new Date()).add(-1, 'days').format('YYYY年MM月DD日')
  param.value.startDate = moment(new Date())
    .add(-30, 'days')
    .format('YYYY-MM-DDT00:00:00Z')
  param.value.endDate = moment(new Date())
    .add(-1, 'days')
    .format('YYYY-MM-DDT23:59:59Z')
}
const isShowDialog = ref(false)
const handleClose = () => {
  isShowDialog.value = false
}
const onShowDialog = () => {
  isShowDialog.value = true
}
const onDelete = () => {
  console.log('点击删除按钮')
  deleteRecordStorage(param.value).then(() => {
    ElMessage.success('删除成功！')
    isShowDialog.value = false
  })
}
let usedProgress = ref(0)
const getRecordData = () => {
  queryRecordStorage().then((res) => {
    let data = res.data
    data.forEach((item: any, index: number) => {
      let gb = 1024 * 1024 * 1024
      let total = Math.round(item.total / gb)
      let used = Math.round(item.used / gb)
      storageList.value[index].totalStorage = total
      storageList.value[index].usedStorage = used
      storageList.value[index].remainStorage = total - used
      usedProgress.value = (used / total) * 100
    })
  })
}
onMounted(() => {
  getRecordData()
})
</script>

<style scoped lang="scss">
.storage-mana {
  margin-top: -10px;
  color: #fff;
  font-weight: 300;
  font-size: 14px;
  height: 100%;
  .storage-con {
    padding: 20px;
    border: 1px solid rgba(1, 162, 173, 1);
    margin-right: 20px;
    .storage-title {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    :deep(.el-progress__text) {
      display: none;
    }
    :deep(.el-progress-bar__outer) {
      border-radius: 5px;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #39dee2;
      border-radius: 5px;
    }
    .storage-details {
      display: block;
      position: relative;
      margin-top: 20px;
      text-align: right;
    }
  }
  .clear-con {
    padding: 20px;
    padding-bottom: 10px;
    margin-top: 20px;
    height: calc(100vh - 234px);
    border: 1px solid rgba(1, 162, 173, 1);
    margin-right: 20px;
    .check-time {
      display: flex;
      margin: 30px 0;
      :deep(.el-select .el-input__wrapper) {
        margin-top: -6px;
      }
      :deep(.el-range-editor.el-input__wrapper) {
        margin-top: -6px;
        margin-left: 10px;
      }
      .auto {
        margin-left: 50px;
        :deep(.el-switch--small) {
          margin-top: -3px;
          margin-left: 10px;
        }
      }
    }
    .clear-time {
      margin-bottom: 30px;
      .details {
        margin-left: 10px;
        color: red;
      }
    }
    .clear-button {
      .danger-button {
        margin-left: 50px;
      }
    }
  }
}
</style>
