<!--
 * @Description:
 * @Autor: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-15 14:34:01
-->
<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { start } from 'qiankun'
export default defineComponent({

  setup() {
    onMounted(() => {
      if (!window.qiankunStarted) {
        window.qiankunStarted = true
        start()
      }
    })
  }
})
</script>
<style lang="scss">
.pagination-container .el-pagination {
  right: 25px;
  position: absolute;
}
</style>
