<!--
 * @Description: 容器组件，实现左右布局自适应
 * @Author: zxk
 * @Date: 2023-11-013
 * @LastEditors: zxk
 * @LastEditTime: 2023-11-08 17:39:34
 * 佛祖保佑没bug
-->
<script setup lang="ts"></script>
<template>
  <div class="page_container">
    <div class="page_left">
      <slot name="menu"></slot>
    </div>
    <div class="page_main_pannal">
      <slot name="top"></slot>
      <div class="main_pannel">
        <slot></slot>
      </div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page_container {
  width: 100%;
  height: var(--clientHeight);
  overflow: hidden;
  display: flex;
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
  background: rgba(29, 37, 45, 1);
  .page_left {
    margin-top: 11px;
    width: 236px;
    height: calc(100% - 11px);
    box-sizing: border-box;
    background: rgba(51, 63, 72, 1);
  }

  .page_main_pannal {
    padding: 0 15px;
    padding-top: 11px;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;

    .main_pannel {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
