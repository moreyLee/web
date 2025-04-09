<template>
  <!-- 老虎机主容器 -->
  <div class="slot-machine">
    <!--  老虎机外框  -->
    <div class="machine-frame">
    <!-- 老虎机 三个滚轴 -->
    <div class="reels">
      <div v-for="(reel, index) in reels" :key="index" class="reel">
        <div
            class="symbols"
            :style="{
            transform: `translateY(${reel.offset}px)`,     // 控制垂直偏移量
            transition: reel.spinning ? 'transform 2.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',    // 控制动画效果
          }"
        >
          <!--   每个滚轴中的图案列表  -->
          <div v-for="(symbol, i) in extendedSymbols" :key="i" class="symbol">
            {{ symbol }}
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- 抽奖按钮 -->
    <button class="spin-button" @click="spin" :disabled="spinning || betAmount <= 0">抽奖</button>
    <!-- 账户信息面板 -->
    <div class="info-panel">
      <div class="account-info">
        <p>💰 账户余额：{{ balance }} 元</p>
      </div>
      <!-- 投注输入框 -->
      <div class="bet-section">
        <label for="bet">投注金额：</label>
        <input id="bet" type="number" v-model="betAmount" min="1" :disabled="spinning" />
      </div>
    </div>
    <!-- 结果展示 -->
    <p  v-if="result" class="result">{{ result || '🎯 正在抽奖...'}}</p>
    <p v-if="reward >= 0" class="reward">🎁 奖励：{{ reward }} 元</p>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, reactive, ref} from "vue";
import {slotSpin} from "@/api/slotMachine"
import {ApiResponse, SpinResponse} from "@/types/models/SlotGame";
// 老虎机图案列表
const symbols = ["🍎", "🍊", "🍇", "🍋", "🍉", "🍒", "⭐"];
// 延长滚轴（5 轮图标，避免滚动太短）扩展图案数组
const extendedSymbols = computed(() => [...symbols, ...symbols, ...symbols, ...symbols, ...symbols]);
// 定义滚轴数据结构
interface Reel {
  offset: number; // 滚轴当前偏移量
  stoppingIndex: number; // 最终停止索引
  spinning: boolean; // 是否在滚动
}

// 定义 3 个转轴
const reels = reactive<Reel[]>([
  { offset: 0, stoppingIndex: 0, spinning: false },
  { offset: 0, stoppingIndex: 0, spinning: false },
  { offset: 0, stoppingIndex: 0, spinning: false },
]);

// 状态变量
const balance = ref<number>(500); // **账户余额**
const spinning = ref(false);    // 是否滚动中
const result = ref<string>("");  //开奖图案
const reward = ref<number>(0);    // 开奖奖金
const betAmount = ref<number>(100); // 默认投注金额

// 抽奖逻辑
const spin = async () => {
  try {
    // 校验条件  滚轴启动条件
    if (spinning.value || betAmount.value <= 0 || betAmount.value > balance.value) return;

    // **扣除投注金额**
    balance.value -= betAmount.value;
    spinning.value = true;
    result.value = "";
    reward.value = 0;

    // **先重置 offset**，避免 Vue 误判状态   重置滚轴位置
    reels.forEach((reel) => {
      reel.spinning = false;
      reel.offset = 0; // 让滚轴瞬间回到顶部
    });

    let response;
    // **请求后端接口 slotSpin 获取结果**
    response = await slotSpin({bet: betAmount.value}) as ApiResponse<SpinResponse>

    // 服务器返回的中奖图案
    const serverResults: string[] = response.data.result;
    // 服务器返回的开奖奖金
    reward.value = typeof response.data.reward === "number" ? response.data.reward : 0
    console.log("服务器返回的抽奖图案",serverResults);
    console.log("完整的服务器响应:", response);
    console.log("服务器返回的开奖奖金",reward.value)

    // **确保服务器返回的数据格式正确**
    if (!response || response.code !== 0  || !response.data) {
      throw new Error("❌ 服务器返回数据格式不正确");
    }
    // ✅ 类型判断 校验 result  是否为数组
    if (!Array.isArray(serverResults) || serverResults.length !== 3) {
      throw new Error("服务器返回无效的抽奖图案结构");
    }
    // ✅ 图案合法性校验
    serverResults.forEach((symbol:unknown) => {
      if (typeof symbol !== "string" ||!symbols.includes(symbol)){
        console.log("无效的图案:",symbol);
      }
    })

    // 等待 Vue DOM 更新
    await nextTick();
    // 控制每个滚轴动画
    reels.forEach((reel, index) => {
      reel.spinning = true; // 标记为滚动状态
      const spinTime = 2500 + index * 800; // 每个轴停下的时间不同
      const extraRounds = 2; // 额外滚动几圈，避免直接停下
      const stoppingIndex = symbols.indexOf(serverResults[index]); // 后端返回的图案索引
      reel.stoppingIndex = stoppingIndex;
      if (stoppingIndex === -1) {
        throw new Error(`❌ 无法找到服务器返回的图案: ${serverResults[index]}`);
      }
      // 计算最终滚动距离 后端的图案 显示在中间位置 +60
      const finalOffset = -(stoppingIndex * 60 + extraRounds * symbols.length * 60) + 60;
      reel.offset = finalOffset;

      // 延迟停止每个转轴
      setTimeout(() => {
        reel.spinning = false;
        if (index === reels.length - 1) {
          setTimeout(() => {
            checkResult()
          }, 500);
        }
      }, spinTime);
    });
  } catch (error) {
    console.error("❌ Spin 错误:", error);
    spinning.value = false;
    balance.value += betAmount.value; // **如果失败，退还投注金额**
    // 给用户一个清晰错误提示
    result.value = `❌ 请求失败：${error instanceof Error ? error.message : '未知错误'}`;
  }
};

// 中奖检测
const checkResult = () => {
  if (reward.value > 0) {
    result.value = "🎉 恭喜中奖！"
    balance.value += reward.value; // **中奖后增加奖金**
  }else {
    result.value =  " 🔄 再试一次";
  }
  spinning.value = false;
};
</script>

<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: radial-gradient(#222, #000);
  min-height: 100vh;
  padding-top: 50px;
  color: #fff;
}

.machine-frame {
  background: #444;
  border: 8px solid #888;
  border-radius: 20px;
  padding: 30px 20px;
  box-shadow: 0 0 20px #000;
}

.reels {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.reel {
  width: 90px; /* 略微增加宽度 */
  height: 180px; /* 增加高度，让滚轴能显示更多内容 */
  overflow: hidden;
  border: 3px solid #333;
  border-radius: 12px;
  position: relative;
  background: #111;
  /*background: #f8f8f8;*/
}

.symbols {
  position: absolute;
  width: 100%;
}

.symbol {
  font-size: 50px; /* 字体放大 */
  text-align: center;
  height: 60px;
  line-height: 60px;
  /**/
  color: #fff;
  text-shadow: 1px 1px 2px #000;
}

/* 抽奖按钮 */
.spin-button {
  margin-top: 30px;
  padding: 12px 36px;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(to bottom, #ffcc00, #ff9900);
  border: none;
  border-radius: 30px;
  color: #000;
  box-shadow: 0 4px 8px rgba(255, 165, 0, 0.6);
  transition: all 0.3s ease;
}
.spin-button:hover {
  background: linear-gradient(to bottom, #ffd700, #ff8000);
  box-shadow: 0 6px 12px rgba(255, 165, 0, 0.8);
}

.spin-button:disabled {
  background: #aaa;
  color: #444;
  cursor: not-allowed;
  box-shadow: none;
}

/* 账户样式 */
.info-panel {
  margin-top: 30px;
  background: #222;
  padding: 15px 25px;
  border-radius: 12px;
  border: 2px solid #555;
  box-shadow: inset 0 0 8px #000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 320px;
}

.account-info,
.bet-section {
  font-size: 18px;
}

input[type='number'] {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 80px;
  margin-left: 6px;
}


.result {
  margin-top: 20px;
  font-size: 20px;
  color: #00bcd4;
}
.reward {
  font-size: 22px;
  margin-top: 10px;
  color: #4caf50;
  font-weight: bold;
}
</style>