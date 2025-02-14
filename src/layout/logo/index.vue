<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: wml
 * @Date: 2023-11-07 19:34:58
 * @LastEditors: wml
 * @LastEditTime: 2023-11-10 11:37:56
 * 佛祖保佑没bug
-->
<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <span class="title">{{ setting.title }}</span>
  </div>
</template>
<script setup lang="ts">
import setting from '@/setting'
</script>
<style lang="scss" scoped>
.logo {
  width: 250px;
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: $base-logo-title-fontSize;
  flex-wrap: nowrap;
  overflow: hidden;
  padding-left: 17px;
  img {
    display: inline-block;
    height: 30px;
    border-radius: 10px;
  }
  .title {
    height: 32px;
    margin: 2px 0 0 18px;
    font-size: 18px;
    line-height: 32px;
  }
}
</style>
