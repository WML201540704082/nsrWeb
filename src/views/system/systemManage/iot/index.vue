<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-21 15:42:08
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-23 17:50:49
 * 佛祖保佑没bug
-->
<template>
  <div class="iot-box">
    <el-form
      :model="iotForm"
      :rules="rules"
      size="mini"
      label-width="110px"
      label-position="right"
    >
      <el-col>
        <el-form-item label="平台开关">
          <el-switch size="small" v-model="iotForm.enabled"></el-switch>
        </el-form-item>
      </el-col>
      <el-col
        :span="24"
        v-for="({ label, name }, index) of formParams"
        :key="index"
      >
        <el-form-item :label="name" :prop="label" v-if="label !== 'passwd'">
          <el-input
            :disabled="!iotForm.enabled"
            v-model="iotForm[label]"
            size="small"
            :placeholder="'请填写' + name"
          ></el-input>
        </el-form-item>
        <el-form-item :label="name" :prop="label" v-else>
          <el-input
            :disabled="!iotForm.enabled"
            type="password"
            v-model="iotForm[label]"
            size="small"
            :placeholder="'请填写' + name"
            show-password
          ></el-input>
        </el-form-item>
      </el-col>
      <el-form-item>
        <el-button type="primary" @click="onSaveIOT">保存并使用</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
// 变量声明部分
interface IotForm {
  enabled: boolean
  accWay: string
  server: string
  user: string
  passwd: string
  topic: string
}
const iotForm: { [key: string]: any } = reactive<IotForm>({
  enabled: false,
  accWay: '设备平台',
  server: '',
  user: '',
  passwd: '',
  topic: '',
})
const formParams = ref([
  { label: 'accWay', name: '平台接入方式' },
  { label: 'server', name: 'IP地址' },
  { label: 'user', name: '用户名' },
  { label: 'passwd', name: '密码' },
  { label: 'topic', name: '主题' },
])
// 校验规则部分
const validateServerIP = function (rule: any, textval: any, callback: any) {
  const urlregex =
    /^(([\w]+:)\/\/)(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:[\d]+)?$/

  if (urlregex.test(textval)) {
    callback()
  } else {
    callback(new Error())
  }
}
// 表单校验部分
const rules = reactive<InstanceType<typeof FormRules>>({
  accWay: [{ required: true, message: '请输入接入方式', trigger: 'blur' }],
  server: [
    { required: true, message: '请输入服务器IP', trigger: 'blur' },
    {
      validator: validateServerIP,
      message: '请输入正确的格式!',
      trigger: 'blur',
    },
  ],
  user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  passwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  topic: [{ required: true, message: '请输入主题', trigger: 'blur' }],
})
// 方法函数部分
const onSaveIOT = () => {
  console.log('点击iot保存按钮')
}
</script>

<style scoped lang="scss"></style>
