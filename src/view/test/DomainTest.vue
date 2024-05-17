<template>
<div>域名测试页面</div>
</template>
<script setup>
import {DomainTest} from "@/api/domain";

export default {
  name: "DomainTest",
  created() {
    DomainTest()
  }
}
</script>

<style scoped lang="scss">

</style>