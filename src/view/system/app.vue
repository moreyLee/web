<template>
  <el-table  :data="apkData" border style="width: 100%">
    <el-table-column label="站点名称" width="220"/>
    <el-table-column label="apk文件" width="220"/>
    <el-table-column label="创建时间" width="220"/>
    <el-table-column label="目录列表" width="220">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span style="margin-left: 10px">{{ scope.row}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="right" >
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索站点app" />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" @click="handUpload(scope.$index, scope.row)"
        >上传文件</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {getAppList} from "@/api/app";
const search = ref('')
const filterTableData = computed(() =>
    apkData.value?.filter(
        (data) =>
            !search.value ||
            data.data.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handUpload = async (index: number, row: Apk) => {

}

interface Apk {   //定义数据接口
  data: string
}
const apkData = ref<Apk[]>();   //apk[] 数组类型变量
onMounted(async () => {   // 挂载http请求获取数据
  const resp = await getAppList(apkData)
  if (resp) {
    apkData.value = resp.data
    console.log(apkData.value)
  }
})

</script>



<style scoped lang="scss">
</style>