<template>
  <div>
  <el-form ref="domainForm" :model="domainInfo" :rules="rules">
  <el-form-item label="短域名">
    <el-input v-model="domainInfo.name" style="width: 240px"
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
  </div>
</template>
<script setup lang="ts">
import {ref, reactive} from 'vue'
import {domain, domainRecord} from "@/api/test";
import {ElMessage} from "element-plus";
defineOptions({
  name: 'Domain',
})
// 定义数据类型接口
interface DomainInfo {
  name: string;
  jump_start : string
}
// 定义了一个domainInfo的响应式变量
// 其类型为 DomainInfo 描述domainInfo 的数据结构
const domainInfo = ref<DomainInfo>({
  name: "ss123.com",
  jump_start : "true"
})
// 定义传入到后端的json body 中的数据  定义的数据
const data ={
  name: domainInfo.value.name,
  jump_start: "true"
}
const record = {
  type: "A",
  name: "@",
  content: "114.114.114.114",
  ttl: 1,
  proxied: true
}
const rules = reactive({
  name: [{ required: true, message: '请输入短域名', trigger: 'blur' , isValidHttpUrl: true}],
})
const submitDomain = async () => {

  // console.log("短域名", domainInfo.value)
  const resp = await domain(data)
  console.log("响应返回:", resp.data)
  if (resp.data.success === true) {
    ElMessage({
      message: domainInfo.value.name+'创建域名成功',
      type: 'success',
    })
  }
  if (resp.data.success === false) {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: domainInfo.value.name +'域名创建失败! <br/>域名已存在',
      type: 'error',
    })
  }
  const zone_id = resp.data.result.id
  if (zone_id != null){
    console.log("zone_id", zone_id)
    const resp = await domainRecord(zone_id, record)
    if (resp.data.success === true) {
      ElMessage({
        message: resp.data.result.name +'域名'+'DNS解析A记录成功' + resp.data.result.content,
      })
    }
  }

}

</script>
<style scoped lang="scss">

</style>