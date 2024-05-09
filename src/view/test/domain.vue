<script setup>

</script>

<template>
  <el-form-item label="短域名">
    <el-input v-model="input" style="width: 240px"  placeholder="请输入短域名" />
  </el-form-item>
  <!--   代理邀请链接 -->
  <el-form-item label="代理链接">
    <el-input v-model="input" style="width: 240px"  placeholder="请输入代理邀请链接" />
  </el-form-item>
  <el-form-item class="btn">   <!-- 按钮区域定义一个类 按钮向右对齐-->
    <el-button type="primary" @click="" style="width: 5%; margin-top: 5px">跳转</el-button>
  </el-form-item>
</template>

<style scoped lang="scss">

</style>