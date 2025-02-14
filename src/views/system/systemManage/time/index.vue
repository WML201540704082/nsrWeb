<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-21 15:42:08
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-06 15:32:25
 * 佛祖保佑没bug
-->
<template>
  <div>
    <div class="time-box">
      <div class="time-con">
        <el-col>
          <span class="dg-span time-span">服务器时间</span>
          <span class="dg-span time-span">
            {{ timeForm.unixSec }}
          </span>
        </el-col>
        <el-col class="sync-way">
          <span class="dg-span time-span sync-title">同步方式</span>
          <el-select
            size="small"
            class="time-select"
            v-model="timeForm.ntp"
            @change="changeMode"
          >
            <el-option label="NTP同步" :value="true"></el-option>
            <el-option label="手动校时" :value="false"></el-option>
          </el-select>
          <div v-if="!timeForm.ntp">
            <el-date-picker
              size="small"
              v-model="manualTime"
              type="datetime"
              :disabled="isAsyncComputer"
              placeholder="选择日期时间"
            ></el-date-picker>
            <el-switch v-if="!isLocal" v-model="isAsyncComputer"></el-switch>
            <span class="dg-span time-span" v-if="!isLocal">
              与计算机时间同步
            </span>
          </div>
          <el-input
            v-model="timeForm.ntpServer"
            size="small"
            v-if="timeForm.ntp"
            placeholder="请输入目标服务器地址"
          />
        </el-col>
      </div>
      <br />
      <div class="dg-button">
        <el-button type="primary" @click="subNtp">同步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { queryDateTime, putDateTime } from '@/api/system/systemManage'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
// 变量声明部分
const isAsyncComputer = ref(false)
const isLocal = ref(false)
const manualTime = ref(new Date())
interface TimeForm {
  unixSec: string
  ntp: boolean
  ntpServer: string
}
const timeForm: { [key: string]: any } = ref<TimeForm>({
  unixSec: '',
  ntp: true,
  ntpServer: '',
})
// 方法函数部分
const changeMode = () => {
  console.log('切换同步方式')
}
const subNtp = () => {
  console.log('点击时间同步按钮')
  let value = timeForm.value
  let param = {
    unixSec: isLocal.value
      ? Math.round(new Date().getTime() / 1000)
      : Math.round(manualTime.value.getTime() / 1000),
    ntp: value.ntp,
    ntpServer: value.ntpServer,
  }
  putDateTime(param).then(() => {
    ElMessage.success('同步成功')
    getTimeData()
  })
}
const getTimeData = () => {
  queryDateTime().then((res: any) => {
    timeForm.value = res
    timeForm.value.unixSec = moment(res.unixSec * 1000).format(
      'YYYY-MM-DD HH:mm:ss',
    )
  })
}
onMounted(() => {
  getTimeData()
})
</script>

<style lang="scss" scoped>
.time-box {
  .time-con {
    // margin-left: 20px;
    margin-top: 5px;
    .time-title {
      margin-left: -20px;
      margin-bottom: 10px;
    }
    .time-span {
      display: inline-block;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    .sync-way {
      display: flex;
      .sync-title {
        margin-top: 10px;
        margin-bottom: 0;
      }
      .time-select {
        margin-top: 4px;
        margin-right: 10px;
      }
    }
  }
}
</style>
