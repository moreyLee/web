<template>
  <el-table  border style="width: 100%">
    <el-table-column  label="站点ID" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.SiteID }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="站点名称" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="服务器组" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.GroupID}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.createdTime }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="站点域名" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.Domain }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row.status }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleAdmin(scope.$index, scope.row)"
        >报表任务重启</el-button
        >
        <el-button size="small" type="primary" @click="quartz(scope.$index, scope.row)"
        >定时任务重启</el-button
        >
        <el-button
            size="small"
            type="primary"
            @click="handleRobot(scope.$index, scope.row)"
        >机器人重启</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import {SiteInfo} from '@/types/models/SiteInfo'
import{ElMessageBox, ElMessage} from "element-plus"; // 导入接口定义的数据类型

const handleAdmin = async (index: number, row: SiteInfo) =>
{
  // console.log("行，列数据\n",index, row)
  console.log("站点ID   ",row.SiteID)
  console.log("服务器组ID ", row.GroupID)
  const data = JSON.stringify({GroupID:row.GroupID,SiteID:row.SiteID})
  await axios.post('api/cmd/restartAdmin',data).then(resp =>{
    console.log("后端接口响应数据", resp.data)
    if (resp.data.status === 200) {
      ElMessageBox.confirm(
          '是否重启'+row.name+'，请确认 ?',
          row.name+row.SiteID,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success',
            center: true,
          }
      )
          .then(() => {
            ElMessage({
              type: 'success',
              message: '已重启\n'+resp.data.msg,
            })
          })
          .catch(() => {
            ElMessage({
              type: 'success',
              message: '已取消',
            })
          })
    }
  })
      .catch(error=>{
        if (error.response) {
          // 服务器返回错误响应
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);

        }else if (error.request) {
          //未收到服务器响应
          console.log("未收到服务器响应", error.request)
        }else {
          console.log("error", error.message)
        }
      });

}
const quartz = async (index: number, row: SiteInfo) => {

}
const handleRobot = async (index: number, row: SiteInfo) => {

}

const tableData = ref<SiteInfo>();
onMounted(async () => {
  const resp = await axios.post<SiteInfo>('api/SiteInfo')
  if (resp) {
    // tableData.value = resp.data
    console.log(tableData.value)
  }
})
</script>

<style>

</style>