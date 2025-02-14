<template>
  <div class="camera_container">
    <DefTable
      :data="
        fileList.slice(
          (model.currentPage - 1) * model.pageSize,
          model.currentPage * model.pageSize,
        )
      "
      style="flex: 1"
      :fit="true"
      @selection-change="handleSelectionChange"
      :columns="columns"
      row-key="id"
      :default-expand-all="false"
    >
      <template v-slot:index>
        <el-table-column label="序号" type="index" width="60">
          <template #default="scope">
            <!-- 判断当前行的数据是否为一级分类，如果不是，则不展示索引 -->
            <span>{{ scope.row.isArea ? scope.row.idx : '' }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column :align="'center'" label="操作" width="160">
        <template #default="scope">
          <template v-if="scope.row.isArea">
            <el-button
              type="primary"
              :disabled="
                getAreaDownload1(scope.row).download || scope.row.download
              "
              text
              @click="downloadFile1(scope.row)"
            >
              下载
            </el-button>
            <!-- <el-button type="danger" text @click="deleteFile(scope.row)">
              删除
            </el-button> -->
          </template>
          <template v-else>
            <span></span>
          </template>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" label="下载状态" width="298px">
        <template #default="scope">
          <div style="font-size: 12px">
            <template v-if="scope.row.isArea">
              <span v-if="getAreaDownload1(scope.row).state === 'F'">
                {{ `${getAreaDownload1(scope.row).msg || '未下载'}` }}
              </span>
              <template v-else>
                <div style="display: flex">
                  <el-progress
                    style="flex: 1"
                    :percentage="getAreaDownload(scope.row).percentage"
                    color="#01a2ad"
                  />
                  <el-icon
                    class="file_control"
                    @click="stopOneDownload(scope.row)"
                  >
                    <CircleClose />
                  </el-icon>
                </div>
              </template>
            </template>
            <template v-else>
              <span></span>
            </template>
          </div>
        </template>
      </el-table-column>
    </DefTable>
    <div class="camera_Bottom_pannel">
      <el-button
        style="background: rgba(28, 131, 252, 1)"
        @click="downloadFileAll"
        type="primary"
      >
        批量下载
      </el-button>
      <div
        style="
          flex: 1;
          display: flex;
          flex-direction: row-reverse;
          margin-right: 20px;
        "
      >
        <el-pagination
          v-model:current-page="model.currentPage"
          v-model:page-size="model.pageSize"
          :page-sizes="[15, 30, 50, 100]"
          small="small"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fileList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="deleteModel"
      title=""
      width="315"
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div style="text-align: center">您确认要删除？</div>
      <template #footer>
        <div style="width: 100%; display: flex; justify-content: center">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="doDelete">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  toRef,
  onUnmounted,
  onBeforeUnmount,
} from 'vue'
import { Download, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import bus from '@/utils/bus'
import type { Ref, getTransitionRawChildren } from 'vue'
import useUserStore from '@/store/modules/user'
import moment from 'moment'
import fileApi from '@/api/file/index'
import { fileAreaReqType } from '@/api/file/type'
import { guid } from '@/utils/guid'
const format = 'YYYY-MM-DD HH:mm:ss'
const props = defineProps({
  fileList: {
    type: Array,
    default: [],
  },
  oldModel: {
    //上一次离开页面前的数据
    type: Object,
  },
})
let userStore = useUserStore()
const downLoadList = toRef(userStore, 'downLoadList') //下载文件的所有信息

const checkSelectable = (row: fileListType) => {
  if (row.isArea) {
    return true
  }
  return false
}
const model = reactive({
  pageSize: props.oldModel?.pageSize || 15,
  currentPage: props.oldModel?.currentPage || 1,
  total: 0,
})
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`, model)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`, model)
}
const columns = reactive([
  {
    display: true,
    props: { type: 'selection', width: 60, selectable: checkSelectable },
  },
  { display: false, dataIndex: 'index' },
  // {
  //   display: true,
  //   props: {
  //     prop: 'name',
  //     width: 60,
  //     label: '序号',
  //     align: 'left',
  //   },
  // },
  {
    display: true,
    props: {
      prop: 'name',
      'min-width': 140,
      label: '区域名称',
      align: 'left',
    },
  },
  {
    display: true,
    props: { prop: 'camera', 'min-width': 120, label: '相机', align: 'left' },
  },
  {
    display: true,
    show: 'date',
    props: {
      prop: 'begin',
      width: 180,
      label: '开始时间',
      align: 'center',
    },
  },
  {
    display: true,
    show: 'date',
    props: { prop: 'end', width: 180, label: '结束时间', align: 'center' },
  },
  // {
  //   display: true,
  //   props: { prop: 'fileSize', width: 120, label: '文件大小', align: 'right' },
  // },
])

const selectFiles: Ref<fileListType[]> = ref([]) //选中列表
const handleSelectionChange = (val: fileListType[]) => {
  let filterList = val.filter((it) => it.isArea === true)
  selectFiles.value = [...filterList]
}

//删除确认
const deleteModel = ref(false)
const handleClose = () => {
  deleteModel.value = false
}

//删除
const deleteItem: any = ref()
const deleteFile = (row: any) => {
  deleteItem.value = { ...row }
  deleteModel.value = true
}
const doDelete = (row: any) => {
  handleClose()
}

//现在是压缩包，区域与下载文件一对一
const getAreaDownload1 = (row: fileListType) => {
  let downloadItem = downLoadList.value.find((it) => it.sessionId === row.id)
  let obj = {
    state: 'F',
    msg: '未下载',
    percentage: 0,
    download: false,
  }
  if (!downloadItem) return obj
  if (downloadItem.state === 'W') obj.msg = '下载文件准备中'
  else if (downloadItem.state === '0') obj.msg = '等待下载中'
  else if (downloadItem.state === '1') {
    obj.state = 'T'
    obj.percentage = downloadItem.percentage
  } else if (downloadItem.state === '2')
    obj.msg = `已下载（${downloadItem.downLoadTime}下载）`
  else if (downloadItem.state === '3') obj.msg = '已取消下载'
  else obj.msg = '下载失败'

  if (['0', '1', 'W'].includes(downloadItem.state)) {
    obj.download = true
  }
  return obj
}

//判断区域下是否有正在下载的文件及获取下载进度  //逻辑已修改暂时无用
const getAreaDownload = (row: fileListType) => {
  let res = {
    noshow: true, //是否启动此展示
    percentage: 0, //当前下载文件进度
    test: '',
    showTest: false,
    download: true,
  }
  let areaDownload = downLoadList.value.filter((it) => it.sessionId === row.id)
  if (areaDownload && areaDownload.length > 0) {
    let fileSize = 0 //计算所有正在下载或已经下载完成的文件的大小
    let currentSize = 0 //计算当前已下载size
    for (let item of areaDownload) {
      let size = Number(item.fileSize)
      let fileDownSize = Number(item.fileDownSize)
      if (item.state === '0' || item.state === 'W') {
        //等待下载文件
        res.noshow = false
        fileSize = fileSize + size
      } else if (item.state === '1') {
        //正在下载
        res.noshow = false
        currentSize = currentSize + fileDownSize
        fileSize = fileSize + size
      } else if (item.state === '2') {
        //下载完成
        res.noshow = false
        currentSize = currentSize + size
        fileSize = fileSize + size
        res.test = `已下载（${item.downLoadTime}下载）`
      } else {
        res.test = item.state === '3' ? '已取消下载' : '下载失败'
      }
    }
    if (fileSize > 0) {
      if (currentSize === 0) {
        res.test = '等待下载队列中！'
        res.showTest = true
      } else if (currentSize === fileSize) {
        res.showTest = true
        res.download = false
      } else {
        res.percentage =
          (currentSize / fileSize) * 100 >= 100
            ? 100
            : Math.floor((currentSize / fileSize) * 100)
      }
    } else {
      if (res.test) {
        res.download = false
        res.noshow = false
        res.showTest = true
      }
    }
  } else {
    res.download = false
  }
  return res
}

const stopOneDownload = (row: fileListType) => {
  bus.emit('stopFileDownload', row.id)
}

//下载文件信息准备
const downloadFile1 = async (
  row: fileListType,
  downloadStart: boolean = true,
) => {
  let fileList = downLoadList.value.filter((it) => it.sessionId === row.id)
  if (fileList) {
    for (let item of fileList) {
      let index = downLoadList.value.findIndex(
        (it) => it.fileId === item.fileId,
      )
      downLoadList.value.splice(index, 1)
    }
  }
  //生成下载记录
  let fileObj = {
    areaId: row.areaId,
    fileDownSize: 0,
    areaName: row.name,
    begin: row.begin,
    end: row.end,
    sessionId: row.id,
    downLoadTime: moment(new Date()).format(format),
    percentage: 0,
    fileSize: '',
    filePath: '',
    fileName: `${row.name}-${moment(new Date(row.begin)).format(
      'YYYYMMDD-HH_mm',
    )}-${moment(new Date(row.end)).format('HH_mm')}.tar.gz`,
    fileId: guid(),
  }
  downLoadList.value.push({ ...fileObj, state: '0' })
  downloadStart && bus.emit('downloadStart') //通知下载  批量下载最后只通知一次
}

//批量下载
const downloadFileAll = () => {
  if (selectFiles.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请勾选需要下载的文件',
    })
    return
  }
  let cnt = 0
  for (let it of selectFiles.value) {
    let findIndex = downLoadList.value.findIndex(
      (item) => item.sessionId === it.id,
    )
    if (findIndex === -1) {
      downloadFile1(it, false)
    } else {
      if (['0', '1', 'W'].includes(downLoadList.value[findIndex].state)) {
        cnt++ //已经正在下载队列
      } else {
        downLoadList.value.splice(findIndex, 1)
        downloadFile1(it, false)
      }
    }
  }
  if (cnt === selectFiles.value.length) {
    ElMessage({
      type: 'warning',
      message: '所有勾选文件均在下载队列，请勿重复下载！',
    })
  } else {
    bus.emit('downloadStart') //通知下载
  }
}
onBeforeUnmount(() => {
  // bus.off('downloadStart')
  bus.off('stopFileDownload')
})
onMounted(() => {})
onUnmounted(() => {})
defineExpose({ model })
</script>

<style lang="scss" scoped>
.camera_container {
  width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: column;
  height: calc(var(--clientHeight) - 11px);
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;

  .file_control {
    margin-left: 5px;
    color: #f5222d;
    cursor: pointer;
  }

  .span_to_a {
    cursor: pointer;
    color: #1890ff;
  }

  .camera_Bottom_pannel {
    height: 70px;
    display: flex;
    align-items: center;
  }
}
</style>
