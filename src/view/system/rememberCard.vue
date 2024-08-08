<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="ID" label="ID" width="50" />
    <el-table-column prop="win" label="赢" width="80" />
    <el-table-column prop="lose" label="输" width="80" />
    <el-table-column prop="stake" label="本金" width="80" />
    <el-table-column prop="odds" label="赔率" width="80" />
    <el-table-column prop="commission" label="佣金" width="80" />
    <el-table-column prop="expectedValue" label="数学期望值" width="100" />
    <el-table-column prop="restartIndex" label="重起位置" width="90" />
    <el-table-column prop="CashFlowIndex" label="现金流水位置" width="110" />
    <el-table-column prop="betCount" label="投注金额" width="90" />
    <el-table-column prop="originalWinLose" label="输赢值" width="80" />
    <el-table-column prop="AdjustedWinLose" label="净输赢值" width="90" />
    <el-table-column prop="winLossRecord" label="胜负路" width="80" />
    <el-table-column prop="result" label="结局" width="80" />
    <el-table-column prop="balance" label="账户余额" width="90" />
    <el-table-column prop="refresh" label="刷新" width="80" />
  </el-table>
  <el-input class="move-down" v-model="input" style="width: 240px" placeholder="请输入投注金额" />
  <div class="mb-4 move-down">
    <el-button type="danger" class="move-down" @click="HouseWinData">庄赢</el-button>
    <el-button type="danger" class="move-down">闲赢</el-button>
    <el-button type="success" class="move-down">庄输</el-button>
    <el-button type="success" class="move-down">闲输</el-button>
  </div>
  <el-table :data="smallData" class="small-move-down" border style="width: 100%" max-height="250">
    <el-table-column fixed prop="ID" label="ID" width="150" />
    <el-table-column prop="stake" label="本金" width="120" />
    <el-table-column prop="net_capital" label="净本金" width="120" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { getAllData, insertRecord} from "@/api/remcard";
import Decimal from 'decimal.js';
import {Funds} from '@/types/models/Funds'
import {ElMessage} from "element-plus";

// 定义表单数据接口类型
interface TableItem {
  ID: string       // ID 必须与后端接口的json 字段一致   必须与table中prop的字段一致
  lose: string
  win: string
  stake: Decimal,
  odds: Decimal
  commission: Decimal,
  expectedValue: Decimal,    // 数学期望值
  restart_index: string       // 重启位置
  CashFlowIndex: string     // 现金流水位置
  bet_amount: Decimal         // 投注金额
  originalWinLose: Decimal  // 输赢值
  AdjustedWinLose: Decimal   // 净输赢值
  winLossRecord: string       // 胜负路
  result: string                // 开局结果
  balance: Decimal              // 账户余额
  refresh: string
}
// 创建一个空的响应式数据 tableData 用于存储TableItem 类型的数据 且初始值为空数组
const tableData = ref<TableItem[]>()
//定义一个组件函数 获取表单数据
onMounted(async () => {
  const resp = await getAllData()
  if (resp) {
    tableData.value = resp.data
    console.log(tableData.value)
  }
})

// 初始化输入框的值
const input = ref('')
// 初始化小表数据接口
const SmallDataInput = ref<Funds>({
  stake: new Decimal(0),
  net_capital: new Decimal(300)
})
// 创建一个响应式数组 用于储存SmallTableItem 类型的数据 且初始值为nul
const smallData = ref<Funds[]>([])
// 定义一个组件函数 获取后端表格数据 函数用于点击事件
const HouseWinData  = async () => {
  console.log("输入框值:"+input.value)
  // 将输入框的值转换为 Decimal 类型并赋值给数据接口
  SmallDataInput.value.stake = new Decimal(input.value)
  const resp = await insertRecord(SmallDataInput.value)
  console.log("resp数据:"+JSON.stringify(resp))
  if (JSON.stringify(resp.request.code) === "0") {
    console.log("响应数据:"+resp.data)
    ElMessage({
      message: resp.data.msg,
      type: "success",
    })
    // smallData.value = resp.data
    // console.log(smallData.value)
  }
}

const deleteRow = (index: number) => {
  smallData.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.move-down {
  position: relative;
  top: 10px; /* 向下移动 10px，可以根据需要调整 */
}
.small-move-down {
  position: relative;
  top: 20px; /* 向下移动 10px，可以根据需要调整 */
}
</style>