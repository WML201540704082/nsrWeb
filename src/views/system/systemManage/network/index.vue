<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-21 15:41:52
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-07 15:43:04
 * 佛祖保佑没bug
-->
<template>
  <div class="network-box">
    <el-form
      :inline="true"
      :model="netWorkForm"
      label-width="80px"
      label-position="right"
      :rules="rules"
      class="network-form"
      ref="ruleFormRef"
    >
      <el-col
        :span="24"
        v-for="({ label, name }, index) of formParams"
        :key="index"
      >
        <el-form-item :label="name" v-if="label !== 'dev'" :prop="label">
          <el-input
            v-model="netWorkForm[label]"
            size="small"
            :placeholder="'请输入' + name"
          />
          <span v-if="label === 'dns'" class="dg-span tip-span">
            eg：如果输入多个DNS，多个DNS之间请用英文逗号(,)分割
          </span>
        </el-form-item>
        <el-form-item :label="label" v-else :prop="label">
          <el-select
            v-model.number="netWorkForm.dev"
            size="small"
            @change="changeDev"
          >
            <el-option label="eth0" value="eth0"></el-option>
            <el-option label="eth1" value="eth1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
    <br />
    <div class="dg-button">
      <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { queryNetwork, putNetwork } from '@/api/system/systemManage'
import { FormInstance, FormRules, ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 变量声明部分
const ruleFormRef = ref<InstanceType<typeof FormInstance>>()
interface NetWorkForm {
  dev: string
  ip: string
  netmask: string
  gateway: string
  dns: string
}
let netWorkForm: any = ref<NetWorkForm>({
  dev: 'eth0',
  ip: '',
  netmask: '',
  gateway: '',
  dns: '',
})
const formParams = ref([
  { label: 'dev', name: 'dev' },
  { label: 'ip', name: 'ip' },
  { label: 'netmask', name: '子网掩码' },
  { label: 'gateway', name: '网关' },
  { label: 'dns', name: 'DNS' },
])
// 校验规则部分
const validateIP = function (rule: any, testValue: any, callback: any) {
  const urlregex =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (urlregex.test(testValue)) {
    callback()
  } else {
    callback(new Error())
  }
}
const validateGateway = function (rule: any, testValue: any, callback: any) {
  const urlregex =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

  if (urlregex.test(testValue) || !testValue) {
    callback()
  } else {
    callback(new Error())
  }
}
const validateDNS = function (rule: any, testValue: any, callback: any) {
  let testValueList = []
  if (testValue instanceof Array) {
    testValueList = testValue
  } else {
    testValueList =
      testValue.indexOf(',') > -1 ? testValue.split(',') : [testValue]
  }
  const urlregex =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  let textCount = 0
  for (let i in testValueList) {
    if (urlregex.test(testValueList[i])) {
      textCount++
    } else {
      callback(new Error())
    }
  }
  if (textCount == testValueList.length) {
    callback()
  }
}
// 表单校验部分
const rules = reactive<InstanceType<typeof FormRules>>({
  ip: [
    { required: true, message: '请输入IP', trigger: 'blur' },
    { validator: validateIP, message: '请输入正确的格式!', trigger: 'blur' },
  ],
  netmask: [
    { required: true, message: '请输入子网掩码', trigger: 'blur' },
    { validator: validateIP, message: '请输入正确的格式!', trigger: 'blur' },
  ],
  gateway: [
    { required: false, message: '请输入网关', trigger: 'blur' },
    {
      validator: validateGateway,
      message: '请输入正确的格式!',
      trigger: 'blur',
    },
  ],
  dns: [
    { required: true, message: '请输入DNS', trigger: 'blur' },
    { validator: validateDNS, message: '请输入正确的格式!', trigger: 'blur' },
  ],
  dev: [{ required: true, message: '请选择dev', trigger: 'blur' }],
})

const getNetWorkData = (e: string) => {
  queryNetwork().then((res: any) => {
    netWorkForm.value = res[e]
  })
}
// 方法函数部分
const onSubmit = async (
  form: InstanceType<typeof FormInstance> | undefined,
) => {
  console.log('点击保存网络配置')
  if (!form) return
  await form.validate((valid: boolean, fields: any) => {
    if (!Array.isArray(netWorkForm.value.dns)) {
      netWorkForm.value.dns = netWorkForm.value.dns.split(',')
    }
    if (valid) {
      console.log('校验通过')
      putNetwork(netWorkForm.value)
        .then((res) => {
          console.log('netWorkForm--res', res)
          ElMessage.success('保存成功，跳转至对应ip')
          setTimeout(() => {
            window.location.href = `http://${netWorkForm.value.ip}`
          }, 100)
        })
        .catch((err) => {
          if (
            err.response.data.code === 403903 &&
            err.response.data.message === 'ip conflict'
          ) {
            ElMessage.error('IP冲突保存失败')
          } else {
            ElMessage.error('保存失败')
          }
        })
    } else {
      console.log('校验失败!', fields)
    }
  })
}
const changeDev = (e: string) => {
  console.log('切换dev', e)
  getNetWorkData(e)
}
onMounted(() => {
  getNetWorkData('eth0')
})
</script>

<style scoped lang="scss">
.network-box {
  width: 100%;
  // height: 100%;
  .network-form {
    margin-top: 10px;
    :deep(.el-input) {
      width: 192px;
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
    .tip-span {
      margin-left: 10px;
    }
  }
}
</style>
