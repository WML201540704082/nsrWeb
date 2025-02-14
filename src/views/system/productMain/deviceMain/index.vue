<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-30 14:12:27
 * 佛祖保佑没bug
-->
<template>
  <div class="device-main">
    <div class="restart-con">
      <el-form
        :inline="true"
        :model="restartForm"
        label-width="110px"
        label-position="right"
      >
        <el-form-item label="重新启动设备">
          <el-button type="primary" @click="onRestart">重启</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-col class="time-con">
        <el-form :model="timeForm" label-width="110px">
          <el-form-item label="定时重启：">
            <el-switch size="small" v-model="timeForm.enabled"></el-switch>
          </el-form-item>
          <el-form-item label="重启类型：">
            <el-select
              :disabled="!timeForm.enabled"
              v-model="timeForm.rebootType"
            >
              <el-option
                v-for="{ label, value } in rebootTimeList"
                :label="label"
                :value="value"
                :key="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重启时间：">
            <el-time-picker
              :disabled="!timeForm.enabled"
              :editable="false"
              v-model="timeForm.rebootTime"
              :clearable="false"
              placeholder="重启时间"
            ></el-time-picker>
            <el-select
              :disabled="!timeForm.enabled"
              v-show="timeForm.rebootType == 2"
              v-model="timeForm.rebootWeek"
            >
              <el-option
                v-for="{ label, value } in timeList"
                :label="label"
                :value="value"
                :key="value"
              ></el-option>
            </el-select>
            <el-select
              :disabled="!timeForm.enabled"
              v-show="timeForm.rebootType != 2 && timeForm.rebootType != 1"
              v-model="timeForm.rebootDay"
            >
              <el-option
                v-for="item in 31"
                :label="item"
                :value="item"
                :key="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-col class="save-button">
            <el-form-item label="">
              <el-button type="primary" @click="onSave">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col> -->
    </div>
    <div class="reset-con">
      <el-form
        :inline="true"
        :model="resetForm"
        label-width="110px"
        label-position="right"
      >
        <el-form-item label="恢复出厂参数">
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { putReset, putReboot } from '@/api/system/productMain'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
let $router = useRouter()
let $route = useRoute()
let userStore = useUserStore()
// const rebootTimeList = ref([
//   { label: '每日重启', value: 1 },
//   { label: '每周重启', value: 2 },
//   { label: '每月重启', value: 3 },
//   { label: '每三月重启', value: 4 },
// ])
// const timeList = ref([
//   { label: '星期一', value: 1 },
//   { label: '星期二', value: 2 },
//   { label: '星期三', value: 3 },
//   { label: '星期四', value: 4 },
//   { label: '星期五', value: 5 },
//   { label: '星期六', value: 6 },
//   { label: '星期日', value: 0 },
// ])
const restartForm = reactive({})
const resetForm = reactive({})
// interface TimeForm {
//   enabled: boolean
//   rebootType: number
//   rebootTime: string
//   rebootWeek: string
//   rebootDay: string
// }
// const timeForm = ref<TimeForm>({
//   enabled: true,
//   rebootType: 1,
//   rebootTime: '',
//   rebootWeek: '',
//   rebootDay: '',
// })
// queryRebootConfig().then((res) => {
//   timeForm.value = res.data
// })
const logOut = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
const onRestart = () => {
  console.log('点击重启按钮')
  putReboot().then(() => {
    ElMessage.success('系统重启成功')
    logOut()
  })
}
// const onSave = () => {
//   console.log('点击保存按钮')
//   putRebootConfig(timeForm.value).then((res) => {
//     console.log('设备维护保存--res', res)
//   })
// }
const onReset = () => {
  console.log('点击重置按钮')
  putReset().then(() => {
    ElMessage.success('恢复出厂参数成功')
    logOut()
  })
}
</script>

<style scoped lang="scss">
.device-main {
  width: calc(100% - 20px);
  :deep(.el-input__wrapper) {
    margin-left: -10px;
    margin-top: 3px;
  }
  .restart-con {
    padding: 20px;
    border: 1px solid rgba(1, 162, 173, 1);
    height: 100px;
  }
  .reset-con {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid rgba(1, 162, 173, 1);
    height: 100px;
  }
}
</style>
