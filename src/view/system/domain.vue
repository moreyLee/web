<template>
  <div>
  <el-form ref="domainForm" :model="domainInfo" :rules="rules">
      <el-form-item label="短域名">
        <el-input v-model="domainInfo.name" style="width: 240px"
              placeholder="请输入短域名"
              clearable
              />
      </el-form-item>
      <el-form-item label="代理链接">
        <el-input v-model="agent_link.actions[0].value.url" style="width: 240px"
              placeholder="请输入代理邀请链接"
              clearable
              />
      </el-form-item>
  <el-form-item class="btn">   <!-- 按钮区域定义一个类 按钮向右对齐-->
    <el-button type="primary" @click="submitDomain" style="width: 5%; margin-top: 5px">邀请代理</el-button>
  </el-form-item>
  </el-form>
  </div>
</template>
<script setup lang="ts">
import {ref, reactive} from 'vue'
import {  domain, DnsRecord, pageRule} from "@/api/domain";
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

// 域名页面规则创建对应的数据结构
interface Constraint{
  operator: string
  value: string
}
interface Action{
  id: string
  value: {
    url: string
    status_code: number
  }
}
interface Target{
  target: string
  constraint: Constraint
}
interface PageRule{
  targets: Target[]
  actions: Action[]
  priority: number
  status: string
}
// 交互式数据
const agent_link = ref<PageRule>({
  targets: [
    {
      target: "url",
      constraint: {
        operator: "matches",
        value: domainInfo.value.name+"/*"
      }
    }
  ],
  actions: [
    {
      id: "forwarding_url",
      value: {
        url: "https://wx.longwaysun.com/app/register.php?site_id=1053&inviteCode=133577",
        status_code: 301
      }
    }
  ],
  priority: 1,
  status: "active"

});

// 初始化json body 中的数据
const RuleData = {
  targets: [
    {
      target: "url",
      constraint: {
        operator: "matches",
        value: domainInfo.value.name+"/*"
      }
    }
  ],
  actions: [
    {
      id: "forwarding_url",
      value: {
        url: agent_link.value.actions[0].value.url,
        status_code: 301
      }
    }
  ],
  priority: 1,
  status: "active"
}

const rules = reactive({
  name: [{ required: true, message: '请输入短域名', trigger: 'blur' , isValidHttpUrl: true}],
})
const submitDomain = async () => {
  /**
   * CF 新建域名
   * */
  const resp = await domain(data)
  console.log("新建域名响应返回:", resp.data)
  if (resp.data.success === true) {
    ElMessage({
      duration: 60000,
      plain: true,
      showClose: true,
      message: domainInfo.value.name+'创建域名成功',
      type: 'success',
    })
  }
  if (resp.data.success === false) {
    ElMessage({
      duration: 60000,
      plain: true,
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: domainInfo.value.name +'域名创建失败! <br/>或域名已存在！',
      type: 'error',
    })
  }
  /**
  * DNS 添加A 记录
  * */
  const zone_id = resp.data.result.id
  if (zone_id != null){
    console.log("zone_id", zone_id)
    const resp2 = await DnsRecord(zone_id, record)
    console.log("DNS接口响应返回:",resp2.data)
    if (resp2.data.success === true) {
      ElMessage({
        duration: 60000,
        plain: true,
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: 'DNS解析A记录成功 ! <br\n>',
        type: 'success',
      })
    }
  }
  /**
   *  PageRule 添加页面规则
   * */
  if (zone_id != null){
    const  resp = await pageRule(zone_id,RuleData)
    console.log("页面规则响应返回:",resp.data)
    if (resp.data.success === true) {
      ElMessage({
        duration: 300000,
        plain: true,
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '页面规则跳转已添加 ! <br\n>'+resp.data.result.actions[0].value.url+'<br\n>'+
            +'跳转码: '+resp.data.result.actions[0].value.status_code,
        type: 'success',
      })
    }
  }

}

</script>
<style scoped lang="scss">

</style>