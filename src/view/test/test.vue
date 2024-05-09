<template>
  <div> 测试页面</div>
</template>

<script >
import {testT} from "@/api/test";

export default {
    name: "Test",
    created() {
       testT()
    }
  }
</script>
<style scoped lang="scss">

</style>