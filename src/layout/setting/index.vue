<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-30 16:24:12
 * 佛祖保佑没bug
-->
<script setup lang="ts">
// import { FullScreen } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { GET_UserName } from '@/utils/userName'
import downloadFile from './downloadFile.vue'
import alarmPannel from './alarmPannel.vue'
import { onMounted, ref } from 'vue'
import bus from '@/utils/bus'
let $router = useRouter()
let $route = useRoute()
let userStore = useUserStore()
const showTransition = ref(false) //控制结束录制动画
onMounted(() => {
  bus.on('endRecording', () => {
    showTransition.value = true //开启动画
    setTimeout(() => {
      showTransition.value = false //关闭动画
    }, 1000)
  })
})
// const fullScreen = () => {
//   let full = document.fullscreenElement
//   if (!full) {
//     document.documentElement.requestFullscreen()
//   } else {
//     document.exitFullscreen()
//   }
// }

const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>
<template>
  <!-- <el-button circle size="small" :icon="FullScreen" @click="fullScreen" /> -->
  <alarmPannel></alarmPannel>
  <downloadFile></downloadFile>
  <el-icon color="#ffffff" size="20px">
    <User />
  </el-icon>
  <el-dropdown>
    <span class="el-dropdown-link" style="cursor: pointer; color: #ffffff">
      {{ GET_UserName() }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 结束录制动画效果 -->
  <transition name="bounce">
    <img
      v-if="showTransition"
      style="z-index: 9999; position: absolute; left: 410px"
      src="@/assets/icons/circle.svg"
      alt=""
    />
  </transition>
</template>
<style lang="scss" scoped>
// img {
//   width: 24px;
//   height: 24px;
//   border-radius: 20px;
//   margin: 0 10px;
// }
</style>
