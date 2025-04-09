<template>
  <div class="slot-machine">
    <!-- 老虎机滚轴 -->
    <div class="reels">
      <div v-for="(reel, index) in reels" :key="index" class="reel">
        <div
            class="symbols"
            :style="{
            transform: `translateY(${reel.offset}px)`,
            transition: reel.spinning ? 'transform 2.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          }"
        >
          <div v-for="(symbol, i) in extendedSymbols" :key="i" class="symbol">
            {{ symbol }}
          </div>
        </div>
      </div>
    </div>
    <!-- 抽奖按钮 -->
    <button @click="spin" :disabled="spinning">抽奖</button>
    <p v-if="result" class="result">{{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from "vue";

// 老虎机图案列表
const symbols = ["🍎", "🍊", "🍋", "🍉", "🍒", "⭐"];
// 延长滚轴（5 轮图标，避免滚动太短）
const extendedSymbols = computed(() => [...symbols, ...symbols, ...symbols, ...symbols, ...symbols]);

// 定义老虎机轴的数据结构
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

// 状态管理
const spinning = ref(false);
const result = ref<string>("");

// 抽奖逻辑
const spin = async () => {
  if (spinning.value) return;
  spinning.value = true;
  result.value = "";

  // **先重置 offset**，避免 Vue 误判状态
  reels.forEach((reel) => {
    reel.spinning = false;
    reel.offset = 0; // 让滚轴瞬间回到顶部
  });

  // 等待 Vue DOM 更新
  await nextTick();

  reels.forEach((reel, index) => {
    reel.spinning = true; // 标记为滚动状态

    const spinTime = 2500 + index * 800; // 每个轴停下的时间不同
    const extraRounds = 3; // 额外滚动几圈，避免直接停下
    const randomIndex = Math.floor(Math.random() * symbols.length);
    reel.stoppingIndex = randomIndex;

    // 计算最终滚动距离
    const finalOffset = -(randomIndex * 60 + extraRounds * symbols.length * 60);
    reel.offset = finalOffset;

    // 延迟停止每个转轴
    setTimeout(() => {
      reel.spinning = false;
      if (index === reels.length - 1) {
        setTimeout(() => {
          checkResult();
          spinning.value = false;
        }, 500);
      }
    }, spinTime);
  });
};

// 中奖检测
const checkResult = () => {
  const [a, b, c] = reels.map((r) => symbols[r.stoppingIndex]);
  result.value = a === b && b === c ? "🎉 恭喜中奖！" : "😢 再试一次";
};
</script>

<style scoped>
.slot-machine {
  text-align: center;
  margin-top: 100px;
}

.reels {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.reel {
  width: 80px; /* 略微增加宽度 */
  height: 180px; /* 增加高度，让滚轴能显示更多内容 */
  overflow: hidden;
  border: 3px solid #333;
  border-radius: 10px;
  position: relative;
  background: #f8f8f8;
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
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.result {
  font-size: 22px;
  margin-top: 10px;
}
</style>