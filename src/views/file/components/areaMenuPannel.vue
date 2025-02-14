<!--
 * @Description: 左侧日期选择区域
 * @Author: zxk
 * @Date: 2023-11-14
 * @LastEditors: wml
 * @LastEditTime: 2024-05-21 15:23:44
 * 佛祖保佑没bug
-->
<template>
  <div class="menu_pannel">
    <div class="title_pannel">
      <span>选择区域及相机</span>
      <img
        style="cursor: pointer"
        @click="searchArea"
        src="@/assets/icons/file-refresh.svg"
        alt=""
      />
    </div>
    <div class="area_item_pannel scroll_style">
      <div v-for="areaItem of areaMenus" :key="areaItem.areaId">
        <div class="area_item_parent">
          <el-icon @click="expandChild(areaItem)">
            <ArrowDown v-if="areaItem.isLeaf" />
            <ArrowUp v-else />
          </el-icon>
          <span class="area_item_name">{{ areaItem.areaName }}</span>
          <el-checkbox
            class="area_item_check"
            v-model="areaItem.checked"
            @change="areaChecked(areaItem)"
          ></el-checkbox>
        </div>
        <ul class="area_item_child" v-show="areaItem.isLeaf">
          <template v-for="cameraItem of areaItem.cameras || []">
            <template
              v-if="cameraItem.channels && cameraItem.channels.length > 0"
            >
              <li
                v-for="(channelItem, index) of cameraItem.channels"
                :key="channelItem.channelId"
              >
                <span class="area_item_name">
                  {{
                    `${cameraItem.cameraName}
                                  ${
                                    (channelItem.channelId === 'stream0' &&
                                      '左目') ||
                                    (channelItem.channelId === 'stream1' &&
                                      '右目') ||
                                    ''
                                  }`
                  }}
                </span>
                <el-checkbox
                  disabled
                  class="area_item_check"
                  v-model="cameraItem.checked"
                  @change="areaChecked(areaItem, cameraItem)"
                ></el-checkbox>
              </li>
            </template>
            <template v-else>
              <li :key="cameraItem.cameraId">
                <span class="area_item_name">{{ cameraItem.cameraName }}</span>
                <el-checkbox
                  disabled
                  class="area_item_check"
                  v-model="cameraItem.checked"
                  @change="areaChecked(areaItem, cameraItem)"
                ></el-checkbox>
              </li>
            </template>
          </template>
          <!-- <li v-for="cameraItem of areaItem.cameras || []" :key="cameraItem.cameraId">
            <span class="area_item_name">{{ cameraItem.cameraName }}</span>
            <el-checkbox disabled class="area_item_check" v-model="cameraItem.checked"
              @change="areaChecked(areaItem, cameraItem)"></el-checkbox>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { reactive, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import bus from '@/utils/bus'
import fileApi from '@/api/file/index'
const props = defineProps({
  oldModel: {
    //上一次离开页面前的数据
    type: Object,
  },
})
const { oldModel } = props
let areaMenus: Array<areaMenuType> = reactive([])
oldModel?.areaMenus?.length > 0 &&
  areaMenus.push(...(oldModel?.areaMenus || []))

const expandChild = (areaItem: areaMenuType) => {
  areaItem.isLeaf = areaItem.isLeaf ? false : true
}

const areaChecked = (areaItem: areaMenuType, cameraItem?: cameraType) => {
  console.log(areaItem, cameraItem)
  for (let item of areaItem.cameras) {
    item.checked = areaItem.checked
  }
  let propData = { areaId: areaItem.areaId, checked: areaItem.checked }
  bus.emit('updateCalendar', propData) //通知更新日历标注信息
}
onBeforeUnmount(() => {
  bus.off('updateCalendar')
})
onMounted(() => {
  // if (oldModel?.areaMenus?.length > 0) {
  //   //如果有历史信息，不再自动查
  //   return
  // }
  searchArea()
})
const searchArea = () => {
  fileApi.areaMenus().then((res) => {
    areaMenus.length = 0
    if (res?.data) {
      for (let item of res.data) {
        item.checked = false
        areaMenus.push(item)
      }
      bus.emit('updateCalendar', { areaId: '', checked: false, clear: true }) //通知更新日历标注信息
    }
  })
}

defineExpose({ areaMenus })
</script>

<style lang="scss" scoped>
.title_pannel {
  height: 33px;
  padding-left: 9px;
  display: flex;
  align-items: center;
  background: linear-gradient(
    -89.94deg,
    rgba(51, 63, 72, 1) 0.2%,
    rgba(1, 162, 173, 1) 100.6%
  );

  > :first-child {
    margin-right: 8px;
  }
}

.menu_pannel {
  height: 35%;
  display: flex;
  flex-direction: column;

  .area_item_pannel {
    flex: calc(100% - 34px);
    padding-left: 9px;
    overflow: auto;

    .area_item_check {
      --el-checkbox-checked-bg-color: #01a2ad;
      --el-border-color-extra-light: #01a2ad;
      --el-fill-color-light: #dcdfe6;
      --el-border-color: rgba(51, 63, 72, 1);
    }

    .area_item_name {
      flex: 1;
    }

    .area_item_parent {
      height: 33px;
      display: flex;
      align-items: center;

      > :first-child {
        cursor: pointer;
      }

      > * {
        margin-right: 18px;
      }
    }

    .area_item_child {
      margin-left: 44px;
      margin-right: 18px;

      > li {
        display: flex;
        align-items: center;
        height: 33px;
      }
    }
  }
}
</style>

<style>
.time_popper_class {
  background-color: rgb(26, 27, 26) !important;
}
</style>
