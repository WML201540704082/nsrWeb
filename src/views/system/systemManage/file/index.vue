<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-22 12:09:18
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-08 14:36:38
 * 佛祖保佑没bug
-->
<template>
  <div class="file-box">
    <span class="dg-span file-span">
      导出时，长文件将自动被分段为
      <el-input v-model="fileTime" size="small" />
      分钟的文件
    </span>
    <br />
    <div class="dg-button">
      <el-button type="primary" @click="saveFileTime">应用</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRecordConfig, postRecordConfig } from '@/api/system/systemManage'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const fileTime = ref('15')
getRecordConfig().then((res) => {
  fileTime.value = res.data['record.file.size']
})
const saveFileTime = () => {
  console.log('点击应用文件时间按钮')
  if (!/^[0-9]+$/.test(fileTime.value)) {
    ElMessage({
      type: 'warning',
      message: '请输入数字',
    })
    return
  }
  if (Number(fileTime.value) > 60) {
    ElMessage({
      type: 'warning',
      message: '最大时间段为60分钟',
    })
    return
  }
  postRecordConfig({ 'record.file.size': fileTime.value }).then((res) => {
    console.log('文件配置--res', res)
    ElMessage.success('文件分段时间修改成功')
  })
}
</script>

<style scoped lang="scss">
.file-box {
  .file-span {
    height: 28px;
    line-height: 28px;
    display: flex;
  }
}
</style>
