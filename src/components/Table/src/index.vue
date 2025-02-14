<template>
  <el-table
    id="dif_table"
    :row-class-name="tableRowClassName"
    :data="data"
    :border="true"
    v-bind="$attrs"
    header-cell-class-name="hearder_cel_class"
  >
    <template v-for="column in columns">
      <el-table-column v-if="column.display" v-bind="column.props">
        <template v-if="column.show === 'date'" #default="scope">
          <!-- 如果为时间，将中间的T转换成 空格 -->
          <span>
            {{
              (scope.row[column.props.prop] &&
                scope.row[column.props.prop].replace('T', ' ')) ||
              ''
            }}
          </span>
        </template>
      </el-table-column>
      <template v-else>
        <slot :name="column.dataIndex"></slot>
      </template>
    </template>
    <slot></slot>
  </el-table>
</template>

<script setup lang="ts">
interface columnType {
  display: boolean
  show?: string
  props: any
  dataIndex?: any
}
const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  columns: {
    type: Array<columnType>,
    default: [],
  },
})

const tableRowClassName = () => {
  // if (selected.value && row[props.rowId] === selected.value) {
  //     console.log(selected.value, row[props.rowId])
  //     return 'selected_item'
  // }
  return ''
}
</script>

<style lang="scss" scoped>
#dif_table {
  --el-border-color-lighter: #64696e; //表格边框颜色
  --el-text-color-regular: #fff;
  --el-text-color-secondary: #fff;
  --el-fill-color-blank: #333f48; //表格背景
  --el-table-header-bg-color: #333f48; //表头背景
  --el-fill-color-light: #606e79;

  :deep(.hearder_cel_class) {
    background-color: #455662;
  }

  .selected_item {
    background-color: #123e57 !important;
  }

  /* el-table 宽度自适应 */
  :deep(.el-table__header-wrapper table) {
    width: 100% !important;
  }

  :deep(.el-table__body-wrapper table) {
    width: 100% !important;
  }

  :deep(.el-table__body) {
    width: 100% !important;
    table-layout: auto;
  }

  :deep(.el-table__footer) {
    table-layout: auto;
  }

  :deep(.el-table__header) {
    table-layout: auto;
  }

  :deep(.el-table__empty-block) {
    width: 100% !important;
  }
}
</style>
