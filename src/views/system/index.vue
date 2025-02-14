<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-13 09:41:48
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-30 18:03:04
 * 佛祖保佑没bug
-->
<template>
  <div class="system">
    <el-menu
      :active-text-color="activeColor"
      background-color="#333f48"
      class="el-menu-vertical-demo system-menu"
      :default-active="activeMenu"
      :text-color="inActiveColor"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <el-sub-menu index="/system/systemManage">
        <template #title>
          <DefSvgIcon
            name="system-manage"
            :color="
              activeMenu.includes('/system/systemManage')
                ? activeColor
                : inActiveColor
            "
          ></DefSvgIcon>
          <span
            class="item-title"
            style="margin-left: 5px"
            :style="{
              color: activeMenu.includes('/system/systemManage')
                ? activeColor
                : inActiveColor,
            }"
          >
            系统配置
          </span>
        </template>
        <el-menu-item index="/system/systemManage/network">
          网络配置
        </el-menu-item>
        <el-menu-item index="/system/systemManage/url">平台配置</el-menu-item>
        <!-- <el-menu-item index="/system/systemManage/iot">IOT平台</el-menu-item> -->
        <el-menu-item index="/system/systemManage/time">时间配置</el-menu-item>
        <el-menu-item index="/system/systemManage/file">文件配置</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/system/productMain">
        <template #title>
          <DefSvgIcon
            name="product-main"
            :color="
              activeMenu.includes('/system/productMain')
                ? activeColor
                : inActiveColor
            "
          ></DefSvgIcon>
          <span
            class="item-title"
            style="margin-left: 5px"
            :style="{
              color: activeMenu.includes('/system/productMain')
                ? activeColor
                : inActiveColor,
            }"
          >
            产品维护
          </span>
        </template>
        <el-menu-item index="/system/productMain/zoneImport">
          区域导入
        </el-menu-item>
        <!-- <el-menu-item index="/system/productMain/deviceLog">
            设备日志
          </el-menu-item> -->
        <el-menu-item index="/system/productMain/deviceInfo">
          设备信息
        </el-menu-item>
        <el-menu-item index="/system/productMain/deviceMain">
          设备维护
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/system/storageMana">
        <DefSvgIcon
          name="storage-mana"
          :color="
            activeMenu == '/system/storageMana' ? activeColor : inActiveColor
          "
        ></DefSvgIcon>
        <span class="item-title">存储管理</span>
      </el-menu-item>
      <el-menu-item index="/system/fullExport">
        <DefSvgIcon
          name="full-export"
          :color="
            activeMenu == '/system/fullExport' ? activeColor : inActiveColor
          "
        ></DefSvgIcon>
        <span class="item-title">全盘导出</span>
      </el-menu-item>
    </el-menu>
    <el-container>
      <el-main class="system-box">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// 菜单栏高亮
let route = useRoute()
const activeMenu = ref('')
const activeColor = ref('#00e3f2')
const inActiveColor = ref('#fff')
activeMenu.value = route.path
console.log('activeMenu.value', activeMenu.value)

watch(route, (newValue) => {
  activeMenu.value = newValue.path
})
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="scss">
.system {
  position: relative;
  height: calc(100vh - 56px);
  background-color: #1d252d;
  .system-menu {
    position: absolute;
    margin-top: 10px;
    width: 186px;
    height: calc(100% - 10px);
    border: none;
    .el-menu-item {
      height: 50px;
      .item-title {
        margin-left: 5px;
      }
      &::after {
        content: '';
        position: absolute;
        width: 3px;
        right: 0;
        height: 100%;
        visibility: hidden;
        opacity: 0;
        background: #00efff;
      }
    }
    .el-menu-item.is-active {
      background-color: #00565c;
      &::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .system-box {
    position: absolute;
    margin-left: 186px;
    width: calc(100% - 186px);
    height: calc(100% - 10px);
    padding: 0;
    padding-left: 20px;
    padding-top: 10px;
    margin-top: 10px;
    :deep(.dg-button) {
      margin-top: 20px;
      margin-left: 20px;
    }
  }
}
</style>
