<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-25 11:34:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-15 11:37:55
-->

<template>
  <a
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <div
    v-else
    @click="push"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isExternal } from '@/utils/validate'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const push = () => {
      console.log(props.to)

      if (props.to === '/dashboard') {
        router.push(props.to)
      } else {
        window.history.pushState(null, props.to, props.to)
      }
    }
    return {
      push,
      isExternal
    }
  }
})
</script>
