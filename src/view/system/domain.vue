<template>
  <el-form ref="domain" v-model="domain" :rules="rules">
  <el-form-item label="短域名">
    <el-input v-model="short_url" style="width: 240px"
              type="text"
              placeholder="请输入短域名"
              clearable
              />

  </el-form-item>
<!--  <el-form-item label="代理链接">-->
<!--    <el-input v-model="agent_url" style="width: 240px"  placeholder="请输入代理邀请链接" />-->
<!--  </el-form-item>-->
  <el-form-item class="btn">   <!-- 按钮区域定义一个类 按钮向右对齐-->
    <el-button type="primary" @click="submitDomain" style="width: 5%; margin-top: 5px">新建域名</el-button>
  </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import {ref, reactive} from 'vue'
import {domain} from "@/api/test";

// v-model将输入框的值和short_url 双向绑定
const short_url = ref("ss36.vip")
const data = [
  {
    name: short_url.value,
    jump_start: "true",

  }
]
const agent_url = ref('')
const rules = reactive({
  short_url: [{ required: true, message: '请输入短域名', trigger: 'blur' , isValidHttpUrl: true}],
})
const submitDomain = async () => {
  const json = qs.stringify(this.domain);
  console.log("短域名", short_url.value)
  console.log("json数据", data)
  const resp = await domain(json)
  console.log("响应返回:", resp.data)
}

</script>
<style scoped lang="scss">

</style>