<template>
  <div> 包网页面2 </div>
</template>


<script setup lang="ts">
import { onMounted } from "vue"
import { bwTestEnv } from "@/api/bw_testEnv";
// 组件挂载后调用 bwTestEnv
onMounted(() =>{
      bwTestEnv()
})
</script>

<style scoped lang="scss">

</style>