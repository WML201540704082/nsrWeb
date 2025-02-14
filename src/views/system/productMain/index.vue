<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-11-21 16:08:02
 * 佛祖保佑没bug
-->
<template>
  <div class="product-main">
    <el-container>
      <el-main class="product-box">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.product-main {
  width: 100%;
  height: 100%;
  position: relative;
  .product-box {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
