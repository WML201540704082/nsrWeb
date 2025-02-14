<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-28 18:40:00
 * 佛祖保佑没bug
-->
<template>
  <div class="device-log">
    <el-form :model="logForm" class="log-form" label-width="80px">
      <el-form-item label="起止时间:" prop="time">
        <el-date-picker
          v-model="logForm.startTime"
          type="datetime"
          size="mini"
          class="ml10"
          :picker-options="pickerOptionsStart"
          placeholder="选择开始时间"
        ></el-date-picker>
        <span class="time-split">-</span>
        <el-date-picker
          v-model="logForm.endTime"
          type="datetime"
          size="mini"
          class="ml10"
          :picker-options="pickerOptionsEnd"
          placeholder="选择结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型:" prop="level">
        <el-select v-model="logForm.level" size="small" clearable>
          <el-option
            v-for="(item, index) in levelList"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="searchLogList">
          搜索
        </el-button>
        <el-button type="primary" @click="download">下载</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      :data="logList"
      tooltip-effect="dark"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="IP" label="IP">
        <template #default="scope">
          {{ scope.row.IP == '::1' ? '127.0.0.1' : scope.row.IP }}
        </template>
      </el-table-column>
      <el-table-column prop="Module" label="模块"></el-table-column>
      <el-table-column prop="UserID" label="用户名">
        <template #default="scope">
          {{ filterStatus(scope.row.UserID, userData) }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          {{ filterStatus(scope.row.level, levelList) }}
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="时间区间">
        <template #default="scope">
          {{ '[' + scope.row.startTime + ' , ' + scope.row.endTime + ']' }}
        </template>
      </el-table-column>
      <el-table-column prop="Content" label="内容"></el-table-column>
      <el-table-column prop="" label="通道ID">
        <template #default="scope">
          {{ scope.row.ChID || '' }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { reactive, ref } from 'vue'

interface LogForm {
  startTime: any
  endTime: Date
  label: string
}
const logForm: { [key: string]: any } = reactive<LogForm>({
  startTime: moment(new Date()).add(-7, 'd'),
  endTime: new Date(),
  label: '',
})
const levelList: any = ref([
  {
    value: 1,
    label: '信息',
  },
  {
    value: 2,
    label: '操作',
  },
  {
    value: 3,
    label: '报警',
  },
  {
    value: 4,
    label: '报错',
  },
  {
    value: 5,
    label: '事件',
  },
])
const pickerOptionsStart = ref({})
const pickerOptionsEnd = ref({})
const logList = ref([])
const userData: any = ref([])
const currentPage = ref(4)
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const searchLogList = () => {
  console.log('搜索日志')
}
const download = () => {
  console.log('点击下载按钮')
}
const filterStatus = (a: string | number | undefined, b: []) => {
  console.log('日志数据处理', a, b)
}
</script>

<style scoped lang="scss">
.device-log {
  .log-form {
    display: flex;
    flex-wrap: wrap;
    .time-split {
      color: #fff;
    }
  }
}
</style>
