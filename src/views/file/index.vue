<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: zxk
 * @Date: 2023-11-10 12:19:07
 * @LastEditors: wml
 * @LastEditTime: 2024-05-21 16:31:47
 * 佛祖保佑没bug
-->
<template>
  <defPage>
    <template v-slot:menu>
      <areaMenuPannel
        ref="areaMenuDom"
        :oldModel="fileData?.areaMenuModel"
      ></areaMenuPannel>
      <areaDatePannel
        ref="areaDateDom"
        @searchList="searchList"
      ></areaDatePannel>
    </template>
    <div class="file_main_pannel">
      <cameraPannel
        ref="cameraDom"
        v-if="showCameraPannel"
        :fileList="fileList"
        :oldModel="fileData?.cameraModel?.model"
      ></cameraPannel>
      <emptyFile v-else></emptyFile>
    </div>
  </defPage>
</template>

<script setup lang="ts">
import areaMenuPannel from './components/areaMenuPannel.vue'
import areaDatePannel from './components/areaDatePannel.vue'
import emptyFile from './components/emptyFile.vue'
import cameraPannel from './components/cameraPannel.vue'
import fileApi from '@/api/file/index'
import { getRecordConfig } from '@/api/system/systemManage'
import {
  ref,
  computed,
  toRef,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
} from 'vue'
import type { Ref } from 'vue'
import moment from 'moment'
import { guid } from '@/utils/guid'
import { storageModel } from '@/utils/index'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
//获取历史信息
const fileData: fileDataType = storageModel('fileData')
const downLoadList = toRef(userStore, 'downLoadList') //下载文件的所有信息
const areaMenuDom: Ref = ref(null) //区域及相机
const cameraDom: Ref = ref(null) //列表
const areaDateDom: Ref = ref(null) //日历
const showCameraPannel = ref(fileData?.cameraModel?.showCameraPannel || false)
const fileList: Ref<fileListType[]> = ref(fileData?.cameraModel?.fileList || [])
const fileLimit = ref(15) //文件限制时间默认15分钟
onBeforeUnmount(() => {
  //离开页面时保存页面的所有数据，再次进入后还原
  // let areaDateModel = {
  //   //日历信息
  //   dateTime: areaDateDom.value?.dateTime.value || undefined,
  //   calendarValue: areaDateDom.value?.calendarValue.value || undefined,
  //   greenDay: areaDateDom.value?.greenDay.value || undefined,
  // }

  let areaMenuModel = {
    //区域及相机信息
    areaMenus: areaMenuDom.value?.areaMenus,
  }

  let cameraModel = {
    //列表数据
    fileList: fileList.value,
    showCameraPannel: showCameraPannel.value,
    model: cameraDom.value?.model,
  }
  storageModel('fileData', { cameraModel, areaMenuModel })
})

onMounted(() => {
  getRecordConfig().then((res) => {
    fileLimit.value = res?.data?.['record.file.size']
      ? Number(res.data['record.file.size'])
      : 15
  })
  showCameraPannel.value = false
})
const areaIds = computed(() => {
  let resArr = []
  let areaMenus: Array<areaMenuType> = areaMenuDom.value?.areaMenus || []
  for (let areaMenu of areaMenus) {
    if (areaMenu.checked) {
      resArr.push(areaMenu.areaId)
    }
  }
  return resArr
})

const getAreaItem = (areaId: string) => {
  let areaMenus: Array<areaMenuType> = areaMenuDom.value?.areaMenus || []
  return areaMenus.find((it) => it.areaId === areaId)
}

const searchList = async (dateProps: { begin: string; end: string }) => {
  if (areaIds.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请勾选需要检索的区域！',
    })
    return
  }
  showCameraPannel.value = true

  let res = await fileApi.areaList({ ...dateProps, areaId: areaIds.value }) // areaId: areaIds.value[0]
  if (res?.data) {
    let files: fileAreaType[] = res.data.fileList
    let fileArr: fileAreaType[] = [] //数据切分
    for (let fileItem of files) {
      let areaItem = getAreaItem(fileItem.areaId)
      fileItem.areaName = areaItem?.areaName || ''
      fileArr.push(...sliceFile(fileItem))
    }

    fileList.value.length = 0
    fileArr.forEach((fileItem, index) => {
      // })
      // for (let fileItem of fileArr) {
      let areaItem = getAreaItem(fileItem.areaId)

      //判读当前文件是否正在下载中或已下载完成（区域相同，起止时间相同）,如果有，直接取当前sessionId 为列表id
      let findItem = downLoadList.value.find((it) => {
        return (
          it.areaId === fileItem.areaId &&
          it.begin === fileItem.begin &&
          it.end === fileItem.end &&
          ['0', '1', '2', 'W'].includes(it.state)
        )
      })

      let obj: fileListType = {
        id: findItem?.sessionId || guid(),
        idx: index + 1,
        areaId: fileItem.areaId,
        name: fileItem.areaName || '',
        camera: `${fileItem.cameras.length}个`,
        isArea: true,
        begin: fileItem.begin,
        end: fileItem.end,
        children: [],
        fileSize: fileItem.fileSize ? fileItem.fileSize : '',
      }
      let arr: fileListType[] = []
      for (let item of fileItem.cameras) {
        let camerasItem = areaItem?.cameras.find(
          (it) => it.cameraId === item.cameraId,
        )
        //判断是否存在左右目,存在继续拆分
        if (item.channels && item.channels.length > 0) {
          for (let channel of item.channels) {
            arr.push({
              id: guid(),
              areaId: channel.channelId,
              name: '',
              camera: `${camerasItem?.cameraName || ''} ${
                (channel.channelId === 'stream0' && '左目') ||
                (channel.channelId === 'stream1' && '右目') ||
                ''
              }`,
              begin: '同上',
              end: '同上',
              fileSize: item.fileSize ? item.fileSize : '',
            })
          }
        } else {
          arr.push({
            id: guid(),
            areaId: item.cameraId,
            name: '',
            camera: camerasItem?.cameraName || '',
            begin: '同上',
            end: '同上',
            children: [],
            fileSize: item.fileSize ? item.fileSize : '',
            channels: item.channels,
          })
        }
      }
      obj.children?.push(...arr)
      fileList.value.push(obj)
    })
  }
}

//数据切分
const sliceFile = (
  fileItem: fileAreaType,
  cnt: number = 1,
  sliceFileArr: fileAreaType[] = [],
): fileAreaType[] => {
  let fileBegin = new Date(fileItem.begin)
  let nextFileBegin = new Date(
    fileBegin.getTime() + fileLimit.value * 60 * 1000,
  ) //.setTime((fileBegin.getTime() + (fileLimit.value * 60 * 1000)))
  if (nextFileBegin.getTime() >= new Date(fileItem.end).getTime()) {
    //如果开始时间与结束时间间隔少于15分钟，直接添加
    let obj: fileAreaType = JSON.parse(JSON.stringify(fileItem))
    obj.areaName = `${obj.areaName} - 片段${cnt}`
    sliceFileArr.push(obj)
    return sliceFileArr
  } else {
    let obj: fileAreaType = JSON.parse(JSON.stringify(fileItem))
    obj.areaName = `${obj.areaName} - 片段${cnt}`
    obj.end = moment(nextFileBegin).format('YYYY-MM-DDTHH:mm:ss')
    sliceFileArr.push(obj)

    let nextFileItem: fileAreaType = JSON.parse(JSON.stringify(fileItem))
    nextFileItem.begin = obj.end
    return sliceFile(nextFileItem, cnt + 1, sliceFileArr)
  }
}
</script>

<style lang="scss" scoped>
.file_main_pannel {
  height: 100%;
  width: 100%;
}
</style>
