<template>
  <div class="file_empty_container">
    <div class="file_empty">
      <img class="file_empty_img" src="@/assets/images/file-empty.png" alt="" />
      <div class="file_empty_text">
        请您在左侧选择区域和时间，然后点击
        <span>[录像检索]</span>
      </div>
    </div>
    <!-- <el-dialog
      title="存储空间不足预警"
      :close-on-click-modal="false"
      :model-value="
        Math.floor((spaceMsg.used * 100) / spaceMsg.total) >= 90 && diskWarning
      "
      :before-close="handleClose"
      :width="790"
      top="168px"
      style="
        --el-dialog-bg-color: #333f48;
        --el-text-color-primary: #fff;
        --el-color-info: #fff;
      "
    >
      <div class="disk_warning_body">
        <div class="disk_top_text">
          <span>NSR存储空间查看</span>
          <span>{{ `共${transformSize(spaceMsg.total)}` }}</span>
        </div>
        <div class="disk_space_pannel">
          <div :style="{ width: `${diskSpace}%` }"></div>
          <div style="flex: 1"></div>
        </div>
        <div class="disk_bottom_text">
          <span>
            {{
              `已经使用${transformSize(spaceMsg.used)} / 剩余${transformSize(
                spaceMsg.residue,
              )}`
            }}
          </span>
        </div>
      </div>
      <template v-slot:footer>
        <div class="disk_warning_footer">
          <el-button type="primary" @click="handleConfirm">处理</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
// import { ref, toRef, onMounted, reactive } from 'vue'
// import useUserStore from '@/store/modules/user'
// import moment from 'moment'
// import { useRouter } from 'vue-router'
// import { transformSize } from '@/utils/index'
// import { queryRecordStorage } from '@/api/system/storageMana'
// const router = useRouter()
// let userStore = useUserStore()
// const alarmList = toRef(userStore, 'alarmList') //下载文件的所有信息
// const spaceMsg = reactive({
//   used: 0,
//   total: 0,
//   residue: 0,
// })
// let alarmObj = alarmList.value.find((it) => it.type === 'alarm')
// const diskWarning = ref(alarmObj ? false : true)
// onMounted(() => {
//   //获取磁盘空间信息
//   queryRecordStorage().then((res) => {
//     let data = res.data
//     if (Array.isArray(data) && data.length > 0) {
//       let msg = data[0]
//       spaceMsg.total = msg.total
//       spaceMsg.used = msg.used
//       spaceMsg.residue = msg.total - msg.used
//       if (alarmObj) {
//         if ((msg.used * 100) / alarmObj >= 90) {
//           alarmObj.total = msg.total
//           alarmObj.use = msg.used
//         } else {
//           let index = alarmList.value.findIndex((it) => it.type === 'alarm')
//           alarmList.value.splice(index, 1)
//         }
//       }
//     }
//   })
// })

// const handleConfirm = () => {
//   handleClose()
//   router.push({ path: '/system/storageMana' })
// }
// const handleClose = () => {
//   diskWarning.value = false
//   let obj = {
//     type: 'alarm',
//     title: '存储空间不足预警',
//     date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
//     use: spaceMsg.used,
//     total: spaceMsg.total,
//   }
//   alarmList.value.push(obj)
// }
</script>

<style lang="scss" scoped>
.file_empty_container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;

  .file_empty {
    margin-top: 153px;
    width: 729px;
    height: 402px;
    position: relative;

    .file_empty_img {
      width: 100%;
      height: 100%;
    }

    .file_empty_text {
      color: #e55225;
      position: absolute;
      bottom: 70px;
      width: 100%;
      height: 26px;
      font-size: 20px;
      text-align: center;
    }
  }

  // .disk_warning_body {
  //   width: 100%;
  //   color: #fff;
  //   font-size: 14px;
  //   display: flex;
  //   flex-direction: column;

  //   .disk_top_text {
  //     display: flex;
  //     height: 20px;
  //     align-items: center;
  //     justify-content: space-between;
  //     margin-right: 10%;
  //   }

  //   .disk_bottom_text {
  //     display: flex;
  //     flex-direction: row-reverse;
  //     margin-right: 10%;
  //   }

  //   .disk_space_pannel {
  //     margin: 18px 0;
  //     width: 100;
  //     height: 51px;
  //     border-radius: 7px;
  //     display: flex;
  //     background-color: #a9a9a9;

  //     > :first-child {
  //       border-radius: 7px;
  //       background-color: rgba(255, 77, 79, 1);
  //     }
  //   }
  // }

  // .disk_warning_footer {
  //   width: 100%;
  //   height: 120px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }

  // :deep(.el-dialog__header) {
  //   font-family: SourceHanSansSC-regular;
  // }

  // :deep(.el-dialog__body) {
  //   border-top: 1px solid #bbb;
  //   // min-height: 200px;
  //   font-family: SourceHanSansSC-regular;
  // }
}
</style>
