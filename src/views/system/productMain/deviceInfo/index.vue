<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-30 17:44:58
 * 佛祖保佑没bug
-->
<template>
  <div class="device-info">
    <div class="basic-info">
      <el-form :model="basicForm" :rules="rules" label-width="90px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="basicForm.name" />
          <el-button type="primary" @click="onSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="device-info">
      <el-form
        :model="deviceForm"
        label-width="100px"
        label-position="right"
        class="device-form"
      >
        <el-col
          :span="24"
          v-for="({ label, name }, index) of formParams"
          :key="index"
        >
          <el-form-item :label="name + '：'">
            <span class="dg-span">{{ deviceForm[label] }}</span>
            <span
              class="dg-span detail-span"
              v-if="label === 'osVersion' || label === 'appVer'"
              @click="showDialog(label)"
            >
              详情
            </span>
          </el-form-item>
        </el-col>
      </el-form>
      <el-dialog v-model="dialogVisible" title="版本详情" width="700px">
        <el-col
          class="sysContent"
          v-for="(item, index) of infoForm"
          :key="index"
        >
          <el-col :span="12" class="sysText">模型名称: {{ item.name }}</el-col>
          <el-col :span="12" class="sysText">
            模型版本: {{ item.version }}
          </el-col>
        </el-col>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  querySystemName,
  querySystemInfo,
  putSystemName,
} from '@/api/system/productMain'
import type { FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const basicForm = ref({
  name: '',
})
const infoForm = ref([{ name: '', version: '' }])
const osInfoForm = ref([])
const appInfoForm = ref([])
const rules = reactive<InstanceType<typeof FormRules>>({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
})
interface DeviceForm {
  deviceId: string
  deviceModel: string
  osName: string
  osVersion: string
  // algVer: string
  appVer: string
}
const deviceForm: { [key: string]: any } = ref<DeviceForm>({
  deviceId: '',
  deviceModel: '',
  osName: '',
  osVersion: '',
  // algVer: '',
  appVer: '',
})
const formParams = ref([
  { label: 'deviceId', name: '设备ID' },
  { label: 'deviceModel', name: '设备类型' },
  { label: 'osName', name: '系统名称' },
  { label: 'osVersion', name: '系统版本' },
  // { label: 'algVer', name: '算法版本' },
  { label: 'appVer', name: '应用版本' },
])
querySystemName().then((res: any) => {
  basicForm.value.name = res.name
  deviceForm.value.deviceId = res.id
  deviceForm.value.deviceModel = res.model
})
querySystemInfo().then((res: any) => {
  deviceForm.value.osName = res.os.name
  deviceForm.value.osVersion = res.os.version
  deviceForm.value.appVer = res.app.version
  osInfoForm.value = res.os.dpks
  appInfoForm.value = res.app.dpks
})
const showDialog = (label: string) => {
  dialogVisible.value = true
  infoForm.value = label === 'osVersion' ? osInfoForm.value : appInfoForm.value
}
const onSave = () => {
  console.log('点击保存设备名称按钮')
  putSystemName(basicForm.value.name).then(() => {
    ElMessage.success('设备名称修改成功!')
  })
}
</script>

<style lang="scss">
.device-info {
  .info-title {
    display: inline-block;
    margin-bottom: 20px;
    font-size: 16px;
  }
  .detail-span {
    color: #1684fc;
    margin-left: 20px;
    cursor: pointer;
  }
  :deep(.el-dialog) {
    background-color: #29343f !important;
  }
  :deep(.el-dialog__title) {
    color: #fff;
    font-weight: 300;
    font-size: 18px;
  }
  :deep(.el-dialog__body) {
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    color: #fff;
    font-weight: 300;
    font-size: 14px;
  }
  .sysContent {
    display: flex;
    .sysText {
      flex: 1;
      margin-bottom: 30px;
      margin-left: 20px;
    }
  }
}
</style>
