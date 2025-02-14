<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-23 17:40:05
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-06 15:27:55
 * 佛祖保佑没bug
-->
<template>
  <div class="url-box">
    <el-form label-width="100px">
      <el-form-item label="启用">
        <el-switch v-model="urlForm.enabled" size="small"></el-switch>
      </el-form-item>
      <el-form-item label="平台地址配置">
        <el-input v-model="urlForm.server" />
      </el-form-item>
    </el-form>
    <br />
    <div class="dg-button">
      <el-button type="primary" class="save-button" @click="onSave">
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { queryPlatform, putPlatform } from '@/api/system/systemManage'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const urlForm = ref({
  enabled: false,
  server: '',
})
const onSave = () => {
  console.log('点击保存按钮')
  putPlatform(urlForm.value).then((res) => {
    console.log('putDateTime--res', res)
    ElMessage.success('平台地址配置成功')
  })
}
queryPlatform('NSR').then((res: any) => {
  if (res.code === 200) {
    urlForm.value = res.data
  }
})
</script>

<style scoped lang="scss">
.url-box {
  :deep(.el-input__wrapper) {
    margin-left: -10px;
  }
}
</style>
