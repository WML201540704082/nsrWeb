<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-30 17:17:25
 * 佛祖保佑没bug
-->
<template>
  <!-- 设置容器宽高为100%  20231113 -->
  <div class="main_container">
    <el-menu
      :default-active="activeMenu"
      active-text-color="#00efff"
      background-color="#333F48"
      text-color="#fff"
      :router="true"
      mode="horizontal"
      class="menu"
      style="
        --el-menu-hover-text-color: #00efff;
        --el-menu-hover-bg-color: #00565c;
        --el-menu-item-height: 64px;
        --el-menu-item-font-size: 16px;
      "
    >
      <div class="menu_left">
        <Logo />
        <el-menu-item index="/control">
          <span>录像控制</span>
        </el-menu-item>
        <el-menu-item index="/file">
          <span>录像文件</span>
        </el-menu-item>
        <el-menu-item index="/system">
          <span>系统设置</span>
        </el-menu-item>
      </div>
      <div class="toolbar_right">
        <Setting />
      </div>
    </el-menu>

    <el-container class="container">
      <el-main>
        <el-scrollbar>
          <!-- <Main /> -->
          <!-- 用Main组件会有动画效果，若想不有动画效果，将Main组件中.fade-enter-active transition设成0s 或者直接用下方的 router-view标签即可 -->
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Setting from './setting/index.vue'
import Logo from './logo/index.vue'
// import Main from './main/index.vue'
import { useRoute } from 'vue-router'
import { resizeWindow } from '@/utils/index'
onMounted(() => {
  resizeWindow()
  window.addEventListener('resize', updateResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateResize)
})
let timer: any = null
const updateResize = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    resizeWindow()
  }, 200)
}

let $route = useRoute()
const activeMenu = ref('')
// activeMenu.value = $route.path.includes('/system') ? '/system' : $route.path
//点击磁盘告警处理跳转到磁盘清理界面也会有activeMenu未更新，因此改为watch
watch(
  $route,
  (newValue) => {
    let arr = newValue.path.split('/')
    activeMenu.value = arr.length < 3 ? newValue.path : `/${arr[1]}`
  },
  { immediate: true },
)
</script>
<style></style>
<style lang="scss" scoped>
.main_container {
  width: 100%;
  min-width: 850px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .container {
    flex: 1;

    :deep(.el-main) {
      --el-main-padding: 0; //设置容器padding为0；

      .el-scrollbar__view {
        height: 100%; //设置容器高度为100%
      }
    }
  }
}

.menu {
  display: flex;
  justify-content: space-between;
  min-width: 750px;
  border-bottom: #1d252d;
}

.menu_left {
  display: flex;
  // flex: 1;
}

.toolbar_right {
  display: flex;
  align-items: center;
  margin-right: 20px;
  // width: 100px;
}

.container {
  .el-main {
    padding: 0;
  }
}

.el-menu-item.is-active {
  background-color: #00565c;
}

.el-menu-item {
  // margin-right: 5px;
}
</style>
