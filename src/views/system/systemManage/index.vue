<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-21 19:13:25
 * 佛祖保佑没bug
-->
<template>
  <div class="system-manage">
    <el-container>
      <el-main class="manage-box">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.system-manage {
  position: relative;
  width: 100%;
  height: 100%;
  .manage-box {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
