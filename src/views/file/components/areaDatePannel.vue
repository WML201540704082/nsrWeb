<!--
 * @Description: 左侧相机选择区域
 * @Author: zxk
 * @Date: 2023-11-14
 * @LastEditors: wml
 * @LastEditTime: 2024-05-21 16:58:32
 * 佛祖保佑没bug
-->
<template>
  <div class="date_pannel">
    <div class="title_pannel">
      <span>选择日期及时间段</span>
    </div>
    <div class="date-wrap">
      <div class="calendar-wrap">
        <el-calendar
          ref="calendarDom"
          :first-day-of-week="7"
          v-model="calendarValue"
          style="background: #003a6b"
          :disabled-date="disabledDate"
        >
          <template #date-cell="{ data }">
            <div @click.stop="clickCalendar($event, data)">
              <p style="text-align: center">
                {{ data.day.split('-').slice(2).join('-') }}
              </p>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                v-if="greenDay.find((item) => item === data.day)"
              >
                <span class="green budge"></span>
              </div>
            </div>
          </template>
          <template #header="{ date }">
            <el-icon class="change_month" @click="selectDate('prev-month')">
              <ArrowLeft />
            </el-icon>
            <span>{{ date }}</span>
            <el-icon class="change_month" @click="selectDate('next-month')">
              <ArrowRight />
            </el-icon>
          </template>
        </el-calendar>
      </div>
    </div>
    <div class="date_picker">
      <div>
        <el-time-picker
          :clearable="false"
          v-model="dateTime"
          is-range
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="开始日期"
        />
        <!-- <div>至</div>
                      <el-time-picker v-model="model.endTime" placeholder="结束时间">
                      </el-time-picker> -->
      </div>
    </div>
    <button class="button_pannel" @click="searchFile">录像检索</button>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, computed, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import bus from '@/utils/bus'
import fileApi from '@/api/file/index'
import moment from 'moment'
import { storageModel } from '@/utils/index'
// const props = defineProps({
//   oldModel: {   //上一次离开页面前的数据
//     type: [Object || undefined]
//   }
// })
// const { oldModel } = props
const oldModel = storageModel('areaDate')
console.log('xxxxxx', oldModel)

const emits = defineEmits(['searchList'])
const dateTime = ref(
  oldModel?.dateTime || [
    new Date(2023, 1, 1, 0, 0, 0),
    new Date(2023, 1, 1, 23, 59, 59),
  ],
)

//日期控件
const calendarValue: Ref<any> = ref(new Date())
oldModel?.calendarValue &&
  (calendarValue.value = new Date(oldModel.calendarValue))
const greenDay: Ref<string[]> = ref(oldModel?.greenDay || [])
const disabledDate = (date: Date) => {
  return date < new Date()
}
const calenderMonth = computed(() => {
  return moment(new Date(calendarValue.value)).format('YYYY-MM')
})
watch(calenderMonth, (val) => {
  console.log('watch calenderMonth', val)
  getCalendar()
})

//更新当前选择日期
const clickCalendar = (event: any, data: any) => {
  if (event) {
    event.stopPropagation()
  }
  calendarValue.value = data.day
}

const calendarDom: Ref = ref(null)
const selectDate = (val: any) => {
  if (!calendarDom.value) return
  calendarDom.value.selectDate(val)
}

//检索文件
const searchFile = () => {
  let day = moment(new Date(calendarValue.value)).format('YYYY-MM-DD')
  let startTime = moment(new Date(dateTime.value[0])).format('HH:mm:ss')
  let endTime = moment(new Date(dateTime.value[1])).format('HH:mm:ss')
  let dateProp = {
    begin: `${day}T${startTime}`,
    end: `${day}T${endTime}`,
  }
  console.log(day, dateProp)
  emits('searchList', dateProp)
}

const areaIds: string[] = reactive([]) //勾选的区域信息
//更新日历标记
const updateCalendar = (area: {
  areaId: string
  checked: boolean
  clear?: boolean
}) => {
  if (area.clear) {
    areaIds.length = 0
  } else {
    let index = areaIds.findIndex((it) => it === area.areaId)
    if (area.checked) {
      if (index === -1) {
        areaIds.push(area.areaId)
      }
    } else {
      if (index > -1) {
        areaIds.splice(index, 1)
      }
    }
  }
  getCalendar()
}

//获取检索日历信息
const getCalendar = () => {
  let day = moment(new Date(calendarValue.value)).format('YYYY-MM-DD')
  let propsDate = getMonth(day)
  let beginTime = '00:00:00'
  let endTime = '23:59:59'
  let reqProps = {
    begin: `${propsDate.begin}T${beginTime}`,
    end: `${propsDate.end}T${endTime}`,
    areaId: areaIds,
  }
  fileApi.areaCalenda(reqProps).then((res) => {
    greenDay.value = []
    for (let it of res?.data || []) {
      greenDay.value.push(it.date ? it.date : it.data)
    }
  })
}

//获取指定月的第一天和最后一天
const getMonth = (dateString: string, format: string = 'YYYY-MM-DD') => {
  let cDay = new Date(dateString)
  return {
    begin: moment(cDay.setDate(1)).format(format), //本月第一天
    end: moment(new Date(cDay.getFullYear(), cDay.getMonth() + 1, 0)).format(
      format,
    ), //本月的最后一天
  }
}

onMounted(() => {
  clickCalendar(null, {
    day: moment(new Date()).format('YYYY-MM-DD'),
  })
  //接收更新日历标记信息
  bus.on('updateCalendar', updateCalendar)
})

onUnmounted(() => {
  //离开页面时保存页面的所有数据，再次进入后还原
  let areaDateModel = {
    //日历信息
    dateTime: dateTime.value,
    calendarValue: calendarValue.value,
    greenDay: greenDay.value,
  }
  storageModel('areaDate', areaDateModel)
})

defineExpose({ dateTime, calendarValue, greenDay })
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

.date_pannel {
  padding-top: 20px;
  height: 64%;
  display: flex;
  flex-direction: column;

  /**日历样式 */
  .date-wrap {
    margin: 8px;
    // width: 100%;
    // height: 300px;
    font-size: 12px;
    margin-top: 20px;
    padding: 10px 0px;
    background: #44535e;
    box-shadow: 0px 12px 47px 16px rgba(0, 0, 0, 0.03);
    border-radius: 2px;
    border: 1px solid rgba(1, 162, 173, 1);

    // 隐藏非本月日历
    :deep(.el-calendar-table__row .prev .el-calendar-day) {
      visibility: hidden;
    }

    :deep(.el-calendar-table__row .next .el-calendar-day) {
      visibility: hidden !important;
    }

    .budge {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: -6px;
    }

    .green {
      background-color: #25b591;
    }

    :deep(.el-calendar__header) {
      // width: 200px;
      width: 100%;
      line-height: 10px;
      background: #44535e;
      border-bottom: 0px solid #868f98;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .change_month {
        cursor: pointer;

        :hover {
          color: #01a2ad;
        }
      }
    }

    :deep(.el-calendar__body) {
      padding: 0 0 0 5px;
      background: #44535e;
    }

    :deep(.el-calendar-table .el-calendar-day) {
      height: 28px;
      line-height: 28px;
      padding: 0 0px;
      font-size: 12px;
      font-family: Microsoft Yahei;
    }

    //第一行日历样式
    :deep(.el-calendar__body thead) {
      position: relative;
    }

    :deep(.el-calendar__body thead > :first-child::before) {
      content: ' ';
      display: block;
      position: absolute;
      left: -6px;
      height: 30px;
      width: 6px;
      border-bottom: 2px solid rgb(158, 162, 162);
    }

    :deep(.el-calendar__body thead th) {
      height: 28px;
      line-height: 28px;
      padding: 0px;
      background-color: rgba(51, 63, 72, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
      text-align: center;
      // font-weight: 500;
      box-sizing: border-box;
      border: 1px solid rgb(122, 125, 125);
      border-bottom: 2px solid rgb(158, 162, 162);
    }

    :deep(.el-calendar-table td) {
      // border: none !important;
      border: 1px solid rgb(122, 125, 125);
      background-color: rgba(51, 63, 72, 1);
      color: rgba(98, 112, 123, 1);
      min-height: 28px;
    }

    :deep(.el-calendar-table td.is-selected) {
      background: #01a2ad;
      color: #fff;
    }

    :deep(.el-backtop, .el-calendar-table td.is-selected p) {
      width: 30px;
      color: white;
      line-height: 35px;
      margin-left: -8px;
      text-align: center;
      background: #44535e;
      // background-image: linear-gradient(to right, #2160dc, #4880f0);
    }

    :deep(.el-backtop, .el-calendar-table td.is-selected p) {
      height: 35px;
      // background-color: #2160dc;
      color: white;
    }
  }

  .date_picker {
    flex: 1;
    margin: 8px;
    display: flex;
    justify-content: center;

    > div {
      width: 218px;
      height: 30px;
      border-radius: 5px;
      background-color: rgba(51, 63, 72, 1);
      color: rgba(184, 188, 197, 1);
      font-size: 14px;
      font-family: Roboto;
      box-sizing: border-box;
      border: 1px solid rgba(1, 162, 173, 1);

      :deep(.el-date-editor) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: none !important;
        border: 0px !important;
        color: #fff;
        box-shadow: 0 0 0 0px;
      }

      :deep(.el-date-editor input) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: none !important;
        border: 0px !important;
        color: #fff;
        font-size: 12px;
      }
    }
  }

  .button_pannel {
    margin: 12px 8px;
    height: 37px;
    line-height: 37px;
    border: 0px;
    border-radius: 4px;
    background-color: rgba(28, 131, 252, 1);
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    cursor: pointer;
    text-align: center;
  }
}
</style>

<style>
.time_popper_class {
  background-color: rgb(26, 27, 26) !important;
}
</style>
