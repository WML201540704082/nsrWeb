<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: leslie
 * @Date: 2023-11-14 17:03:10
 * @LastEditors: leslie
 * @LastEditTime: 2023-12-01 11:10:26
 * 佛祖保佑没bug
-->
<template>
  <div class="full-export">
    <el-form :model="dateForm" label-width="60px">
      <el-form-item
        :rules="{ required: true, message: '请选择时间', trigger: 'blur' }"
        class="time-con"
        label="时间"
      >
        <el-date-picker
          v-model="dateForm.date"
          type="date"
          @change="changeDate"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <div class="button-con">
      <el-button class="reset-button" @click="onReset">重置</el-button>
      <el-button type="primary" @click="onExport">导出</el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="导出" width="700px">
      <el-form :model="exportForm" label-width="100px" class="export-form">
        <el-form-item label="选择设备：">
          <el-select v-model="exportForm.devName" @change="onDevChange">
            <el-option
              v-for="item in devList"
              :label="item.name"
              :key="item.name"
              :value="item.path"
            ></el-option>
          </el-select>
          <span @click="getDiskList">
            <el-icon class="refresh-icon"><Refresh /></el-icon>
          </span>
        </el-form-item>
        <el-form-item label="选择路径：">
          <el-input
            placeholder="挂载路径"
            disabled="disabled"
            type="text"
            v-model="exportForm.devPath"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="fm">
        <!-- <div>
          <span @click="onMenuClick(1)" class="add-document">
            <el-icon><DocumentAdd /></el-icon>
            新建文件夹
          </span>
        </div> -->
        <el-table
          ref="multipleTable"
          v-loading="loading1"
          element-loading-text="正在加载中"
          :data="fileList"
          tooltip-effect="dark"
          height="280"
          highlight-current-row
          @cell-dblclick="onCellDBClick"
          @cell-click="onCellDBClick"
          @row-contextmenu="onRightClick"
          @sort-change="onSortChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            sortable="custom"
            prop="name"
            label="名称"
            :width="277"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <el-input
                v-if="
                  scope.row.name != '..' &&
                  editRow &&
                  scope.row.index == editRow.index
                "
                :ref="'input' + scope.row.index"
                class="rename-input a1"
                v-model="scope.row.name"
                @blur="menuInputBlur"
                @keyup="$event.target.blur()"
                auto-complete="off"
              ></el-input>
              <span v-else-if="scope.row.type == 'D' || scope.row.name == '..'">
                {{ scope.row.name }}
              </span>
              <span
                v-else-if="
                  scope.row.type == 'F' &&
                  (scope.row.ext == 'ZIP' ||
                    scope.row.ext == 'TAR' ||
                    scope.row.ext == 'GZ' ||
                    scope.row.ext == 'RAR')
                "
              >
                {{ scope.row.name }}
              </span>
              <span
                v-else-if="
                  scope.row.type == 'F' &&
                  (scope.row.ext == 'MP4' ||
                    scope.row.ext == 'H264' ||
                    scope.row.ext == 'WMV' ||
                    scope.row.ext == 'AVI')
                "
              >
                {{ scope.row.name }}
              </span>
              <span
                v-else-if="
                  scope.row.type == 'F' &&
                  (scope.row.ext == 'JPG' ||
                    scope.row.ext == 'JPEG' ||
                    scope.row.ext == 'PNG' ||
                    scope.row.ext == 'BMP')
                "
              >
                {{ scope.row.name }}
              </span>
              <span v-else>
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="size"
            label="大小"
            :width="100"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="type"
            label="类型"
            :width="100"
          >
            <template #default="scope">
              <template v-if="scope.row.type">
                <template v-if="scope.row.type == 'D'">文件夹</template>
                <template v-else>文件</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="updatedAt"
            label="修改日期"
            :width="180"
          ></el-table-column>
        </el-table>
      </div>
      <div>
        <span class="remain-span">剩余空间：{{ available }}</span>
      </div>
      <!-- <div id="menu" class="menuDiv">
        <ul class="menuUl">
          <li
            v-for="(item, index) in menus[menuRole]"
            :key="index"
            @click.stop="onMenuClick(item.operType)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            size="medium"
            @click="onSave"
            :disabled="exportForm.devPath == ''"
          >
            保存
          </el-button>
          <el-button size="medium" @click="dialogVisible = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <div
      class="export-progress"
      v-show="showProgress"
      v-for="({ progress, sessionId }, index) in progressList"
      :key="index"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="progress"
      />
      <span class="dg-span" @click="stopExport(sessionId)">停止导出</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  explorerMng,
  queryExplorerSession,
  queryExplorer,
} from '@/api/system/fullExport'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

let devList: any = ref([])
const dateForm = ref({
  date: moment(new Date()).format('YYYY-MM-DD'),
})
let fileList: any = ref([])
let available = ref('')
let loading1 = ref(false)
let dialogVisible = ref(false)
let exportForm = ref({
  devIndex: -1,
  devName: '',
  devPath: '',
})
let selectedRow = ref()
let editOldName = ref('')
let editRow = ref()
// let menus: any = ref([
//   // EXPLORER_GET_DISKS = "disks_removable"
//   // EXPLORER_GET_FILES = "list"
//   // EXPLORER_GET_FILE = "file"
//   // EXPLORER_CREATE_DIR = "mkdir"
//   // EXPLORER_RENAME_FILE = "rename"
//   // EXPLORER_REMOVE_FILE = "rm"
//   // EXPLORER_DISK_FREE = "free"
//   // EXPLORER_START_COPY = "copy_start"
//   // EXPLORER_STOP_COPY = "copy_stop"
//   [
//     { name: '创建目录', operType: 1 },
//     { name: '创建目录并进入', operType: 2 },
//     { name: '刷新', operType: 3 },
//     { name: '重命名', operType: 'rename' },
//     { name: '删除', operType: 'rm' },
//   ],
//   [
//     { name: '创建目录', operType: 1 },
//     { name: '创建目录并进入', operType: 2 },
//     { name: '刷新', operType: 3 },
//   ],
// ])
const onReset = () => {
  console.log('点击重置按钮')
  dateForm.value = {
    date: '',
  }
}
const onExport = () => {
  console.log('点击导出按钮!')
  if (!dateForm.value.date) {
    ElMessage.warning('请选择导出的时间')
    return
  }
  getDiskList()
  dialogVisible.value = true
}
const getDiskList = () => {
  let obj = {}
  explorerMng('disks_removable', obj)
    .then((res: any) => {
      if (res.code === 200) {
        let arr = res.data || []
        devList.value = arr
        if (devList.value.length > 0) {
          exportForm.value = {
            devIndex: 0,
            devName: devList.value[0].name,
            devPath: devList.value[0].path,
          }
          getDiskFree(devList.value[0].path)
          getFileList(devList.value[0].path)
        } else {
          exportForm.value = {
            devIndex: -1,
            devName: '',
            devPath: '',
          }
          available.value = ''
          fileList.value = []
        }
      }
    })
    .catch((err) => {
      console.log('获取外接硬盘失败', err)
    })
}
const onDevChange = (e: any) => {
  let Index = devList.value.findIndex((item: any) => {
    return e == item.path
  })
  let obj = devList.value[Index]
  exportForm.value = {
    devIndex: Index,
    devName: obj.name,
    devPath: obj.path,
  }
  getDiskFree(obj.path)
  getFileList(obj.path)
}
const getDiskFree = (path: string) => {
  let obj = { curPath: path }
  explorerMng('free', obj)
    .then((res: any) => {
      if (res.code === 200) {
        available.value = res.data[0].free
      }
    })
    .catch((err) => {
      console.log('获取磁盘空间失败', err)
    })
}
const getFileList = (path: string) => {
  let obj = { curPath: path }
  loading1.value = true
  explorerMng('list', obj)
    .then((res: any) => {
      loading1.value = false
      if (res.code === 200) {
        if (!fileType.value) {
          res.data = res.data.filter((item: any) => {
            return item.name.slice(-7) === '.tar.gz' || item.type === 'D'
          })
        } else if (fileType.value === 'image') {
          res.data = res.data.filter((item: any) => {
            return (
              item.name.slice(-4) === '.jpg' ||
              item.name.slice(-4) === '.jpeg' ||
              item.name.slice(-4) === '.png' ||
              item.name.slice(-4) === '.bmp' ||
              item.type === 'D'
            )
          })
        } else if (fileType.value === 'excel') {
          res.data = res.data.filter((item: any) => {
            return (
              item.name.slice(-5) === '.xlsx' ||
              item.name.slice(-5) === '.xlsb' ||
              item.name.slice(-5) === '.xlsm' ||
              item.name.slice(-5) === '.xltx' ||
              item.type === 'D'
            )
          })
        }
        refreshFileList(res.data || [])
      }
    })
    .catch((err) => {
      loading1.value = false
      console.log('获取文件列表失败', err)
    })
}
const refreshFileList = (arr: any) => {
  fileList.value = []
  if (
    exportForm.value.devPath != devList.value[exportForm.value.devIndex].path
  ) {
    fileList.value.push({
      index: -1,
      name: '..',
      size: '',
      type: '',
      updatedAt: '',
      ext: '',
    })
  }
  let i = 0
  arr.forEach((item: any) => {
    let index = item.name.lastIndexOf('.')
    let ext = ''
    if (index > 0) {
      ext = item.name.substr(index + 1)
    }
    fileList.value.push({
      index: i++,
      ...item,
      ext: ext.toUpperCase(),
    })
  })
}
const onCellDBClick = (row: any) => {
  if (row.type == 'D') {
    if (exportForm.value.devPath.includes('.tar.gz')) {
      exportForm.value.devPath = exportForm.value.devPath.substring(
        0,
        exportForm.value.devPath.lastIndexOf('/'),
      )
    }
    exportForm.value.devPath = exportForm.value.devPath + '/' + row.name
    getFileList(exportForm.value.devPath)
  } else if (row.name == '..') {
    let parentPath = exportForm.value.devPath.substring(
      0,
      exportForm.value.devPath.lastIndexOf('/'),
    )
    exportForm.value.devPath = parentPath
    getFileList(parentPath)
  } else if (row.type == 'F') {
    if (exportForm.value.devPath.includes('.tar.gz')) {
      exportForm.value.devPath = exportForm.value.devPath.substring(
        0,
        exportForm.value.devPath.lastIndexOf('/'),
      )
    }
    let isFile =
      exportForm.value.devPath.includes('.jpg') ||
      exportForm.value.devPath.includes('.jpeg') ||
      exportForm.value.devPath.includes('.png') ||
      exportForm.value.devPath.includes('.bmp') ||
      exportForm.value.devPath.includes('.xlsx') ||
      exportForm.value.devPath.includes('.xlsb') ||
      exportForm.value.devPath.includes('.xlsm') ||
      exportForm.value.devPath.includes('.xltx')
    exportForm.value.devPath = isFile
      ? exportForm.value.devPath.split('/').slice(0, -1).join('/') +
        '/' +
        row.name
      : exportForm.value.devPath + '/' + row.name
    getFileList(exportForm.value.devPath)
  }
}
import { queryRecordStorage } from '@/api/system/storageMana'
import moment from 'moment'
const fileType = ref('')
const multipleSelection: any = ref([])
let srcPath = ref('')
let srcDir = ''
const showProgress = ref(false)
const changeDate = () => {
  srcDir =
    srcPath.value +
    '/data/disk0/' +
    moment(dateForm.value.date).format('YYYY-MM-DD')
}
queryRecordStorage().then((res) => {
  srcPath.value = res.data[0].path
  srcDir = srcPath.value + '/data/disk0/' + dateForm.value.date
})
let progressList: any = ref([])
let timer = ref()
let progressNum = ref(0)
const queryProgress = () => {
  queryExplorerSession(randomId).then((res) => {
    console.log('查询导出进度--res', res)
    showProgress.value = true
    let progress = Math.floor(res.data.progress)
    progress = progress >= 100 ? 100 : progress
    progressList.value[progressNum.value] = {
      progress,
      session: res.data.sessionId,
    }
  })
}
const queryCreatedProgress = () => {
  queryExplorer().then((res) => {
    console.log('每次进入页面查询导出进程--res', res)
    let data = res.data
    if (data) {
      showProgress.value = true
      progressList.value = []
      for (let i = 0; i < Object.keys(data).length; i++) {
        let obj = Object.values(data)[i] as any
        if (obj.errcode) {
          progressList.value[i] = {
            sessionId: obj.sessionId,
            progress: '导出中断',
          }
          let span: any = document.getElementsByClassName(
            'el-progress-bar__innerText',
          ) as unknown as HTMLElement
          span[0].innerText = span[0].innerText.slice(0, 4)
        } else {
          let progress = Math.floor(obj.progress)
          progress = progress >= 100 ? 100 : progress
          progressList.value[i] = { progress, sessionId: obj.sessionId }
        }
      }
    }
  })
}
let randomNumber = Math.floor(Math.random() * 10000) + 1
let randomId = String(randomNumber * randomNumber)
const onSave = () => {
  let dstDir = exportForm.value.devPath + '/' + randomId
  let obj = {
    srcDir,
    dstDir,
    sessionId: randomId,
    fid: randomId,
  }
  explorerMng('copy_dir_start', obj).then(() => {
    ElMessage.success('开始导出')
    dialogVisible.value = false
    progressNum.value = progressList.value.length
    queryProgress()
    randomId += 1
  })
}
const stopExport = (sessionId: string) => {
  let obj = {
    sessionId,
  }
  explorerMng('copy_stop', obj).then(() => {
    ElMessage.success('停止成功')
  })
}
const intervalCreatedProgress = () => {
  timer.value = setInterval(() => {
    queryCreatedProgress()
  }, 1000)
}
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
const onSortChange = (column: any) => {
  let fieldName = column.prop
  let sortingType = column.order
  let tableData = []
  let fixRow = null
  fileList.value.map((item: any) => {
    if (item.name == '..') {
      fixRow = item
    }
  })
  fileList.value.forEach((item: any, index: number) => {
    if (item.name == '..') {
      fileList.value.splice(index, 1)
    }
    return item
  })
  if (sortingType == 'ascending') {
    fileList.value = fileList.value.sort((a: any, b: any) =>
      a[fieldName] > b[fieldName] ? 1 : a[fieldName] == b[fieldName] ? 0 : -1,
    )
  } else if (sortingType == 'descending') {
    fileList.value = fileList.value.sort((a: any, b: any) =>
      a[fieldName] < b[fieldName] ? 1 : a[fieldName] == b[fieldName] ? 0 : -1,
    )
  }
  if (fixRow != null) {
    tableData.push(fixRow, ...fileList.value)
    fileList.value = tableData
  }
}
const menuRole = ref(0)
const onRightClick = (row: any, column: any, event: any) => {
  if (row.name == '..') {
    return
  }
  menuRole.value = 0
  let menu = document.getElementById('#menu') as HTMLElement
  event.preventDefault()
  menu.style.left = event.clientX - 465 + 'px'
  menu.style.top = event.clientY - 106 + 'px'
  menu.style.display = 'block'
  selectedRow.value = row
}
const menuInputBlur = () => {
  let oldName = editOldName.value
  let newName = editRow.value.name
  editOldName.value = ''
  editRow.value = null
  if (oldName == newName) {
    return
  }
  loading1.value = true
  let obj = {
    curPath: exportForm.value.devPath,
    oldName: oldName,
    newName: newName,
  }
  explorerMng('rename', obj)
    .then((res: any) => {
      loading1.value = false
      if (res.code === 200000) {
        refreshFileList(res.data || [])
      }
    })
    .catch(() => {
      loading1.value = false
      ElMessage.error('重命名文件失败')
    })
}
const onMenuClick = (index: number) => {
  if (index === 1) {
    loading1.value = true
    let obj = {
      curPath: exportForm.value.devPath,
      newDir: 'NewFolder',
      enter: false,
    }
    explorerMng('mkdir', obj)
      .then((res: any) => {
        loading1.value = false
        if (res.code === 200000) {
          refreshFileList(res.data || [])
        }
      })
      .catch(() => {
        loading1.value = false
        ElMessage.error('新建文件夹失败')
      })
  } else if (index === 2) {
    loading1.value = true
    let obj = {
      curPath: exportForm.value.devPath,
      newDir: 'NewFolder',
      enter: true,
    }
    explorerMng('mkdir', obj)
      .then((res: any) => {
        loading1.value = false
        if (res.code === 200000) {
          exportForm.value.devPath = exportForm.value.devPath + '/NewFolder'
          refreshFileList(res.data || [])
        }
      })
      .catch(() => {
        loading1.value = false
        ElMessage.error('新建文件夹失败')
      })
  } else if (index === 3) {
    getDiskFree(exportForm.value.devPath)
    getFileList(exportForm.value.devPath)
  } else if (index === 4) {
    editOldName.value = selectedRow.value.name
    editRow.value = selectedRow.value
    // $nextTick(() => {
    //   $refs['input' + selectedRow.value.index].focus()
    // })
  } else if (index === 5) {
    loading1.value = true
    let obj = {
      curPath: exportForm.value.devPath,
      fileName: selectedRow.value.name,
      isDir: selectedRow.value.type == 'D',
    }
    explorerMng('rm', obj)
      .then((res: any) => {
        loading1.value = false
        if (res.code === 200000) {
          refreshFileList(res.data || [])
        }
      })
      .catch(() => {
        loading1.value = false
        ElMessage.error('删除文件失败')
      })
  }
  let menu = document.getElementById('menu') as HTMLElement
  menu.style.display = 'none'
}
onMounted(() => {
  intervalCreatedProgress()
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.el-table {
  border: 1px solid rgba(1, 162, 173, 1);
  --el-table-border-color: rgba(1, 162, 173, 1);
  --el-table-text-color: #bdbdbe;
  --el-table-header-text-color: #bdbdbe;
  --el-table-row-hover-bg-color: rgba(26, 102, 109, 0.5);
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  --el-fill-color-lighter: rgba(26, 102, 109, 0.5);
}

.full-export {
  .time-con {
    .time-list {
      margin-left: 10px;
      margin-top: 20px;
    }
    .add-button {
      margin-left: 10px;
      color: #176ac4;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .area-con {
  }
  .camera-con {
    display: flex;
    .camera-check {
      margin-left: 10px;
      .check-all {
        flex: 100%;
      }
      .check-list {
        width: calc(100% - 120px);
        height: 100px;
        border: 1px solid rgba(1, 162, 173, 1);
        border-radius: 5px;
        margin-top: 10px;
        padding: 10px;
      }
    }
  }
  .button-con {
    margin-top: 30px;
    .reset-button {
      margin-right: 40px;
    }
  }
  :deep(.el-dialog) {
    background-color: #29343f !important;
  }
  :deep(.el-dialog__title) {
    color: #fff;
    font-weight: 300;
    font-size: 18px;
  }
  :deep(.el-dialog__body) {
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }
  .refresh-icon {
    margin-top: 10px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  .add-document {
    margin-bottom: 20px;
    display: inline-block;
    cursor: pointer;
  }
  .remain-span {
    display: inline-block;
    margin-top: 10px;
  }
  .export-progress {
    margin: 20px;
    margin-top: 50px;
    :deep(.el-progress) {
      width: calc(100% - 100px);
      display: inline-block;
    }
    .dg-span {
      width: 80px;
      margin-left: 20px;
      color: #1684fc;
      cursor: pointer;
    }
    :deep(.el-progress__text) {
      display: none;
    }
    :deep(.el-progress-bar__outer) {
      border-radius: 5px;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #39dee2;
      border-radius: 5px;
    }
  }
}
</style>
