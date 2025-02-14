<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-01 10:54:43
 * 佛祖保佑没bug
-->
<template>
  <div class="zone-import">
    <el-upload
      class="upload-demo"
      @change="handleFileUpload"
      ref="upload"
      :limit="1"
      accept=".json"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">只能上传json文件</div>
      </template>
    </el-upload>
    <!-- <input type="file" @change="handleFileUpload" /> -->
    <div id="json-con" v-show="isFile"></div>
    <div class="button-con">
      <el-button type="primary" @click="importFile">导入配置文件</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { postArea } from '@/api/system/productMain'
import type { UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const upload = ref<typeof UploadInstance>()
let isFile = ref(false)
let fileContent: any = null
const handleFileUpload = (e: any) => {
  isFile.value = true
  const file = e.raw
  const reader = new FileReader()

  reader.onload = (e: any) => {
    fileContent = e.target.result
    try {
      let isJSON = JSON.parse(fileContent)
      console.log('isJSON', isJSON)

      if (isJSON) {
        let con = document.getElementById('json-con') as HTMLElement
        con.innerText = fileContent
      }
    } catch (error) {
      isFile.value = false
      ElMessage.closeAll()
      ElMessage.warning('文件解析失败，请选择其他JSON文件')
      upload.value!.clearFiles()
      return
    }
  }

  reader.readAsText(file)
}
const importFile = () => {
  console.log('点击导入配置文件按钮')
  postArea(fileContent).then(() => {
    console.log('导入配置文件')
    ElMessage.success('导入配置文件成功')
    upload.value!.clearFiles()
    isFile.value = false
  })
}
const reset = () => {
  upload.value!.clearFiles()
  isFile.value = false
  console.log('点击导入配置文件按钮')
}
</script>

<style scoped lang="scss">
.zone-import {
  width: 100%;
  height: 100%;
  :deep(.el-upload-list__item .el-upload-list__item-info) {
    display: none;
  }
  :deep(.el-upload__tip) {
    color: #ffffffa1;
  }
  :deep(.el-upload-list__item.is-success .el-upload-list__item-status-label) {
    display: none;
  }
  #json-con {
    padding: 20px;
    border: 1px solid rgba(1, 162, 173, 1);
    color: #fff;
    font-weight: 300;
    margin-bottom: 20px;
  }
}
</style>
