<template>
  <div class="commit-table">
    <div class="commit-table-title">
      更新日志
    </div>
    <div class="log">
      <div
        v-for="(item,key) in dataTimeline"
        :key="key"
        class="log-item"
      >
        <div class="flex-1 flex key-box">
          <span
            class="key"
            :class="key<3&&'top'"
          >{{ key+1 }}</span>
        </div>
        <div class="flex-5 flex message">{{ item.message }}</div>
        <div class="flex-3 flex form">{{ item.from }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Commits } from '@/api/github'
import { formatTimeToStr } from '@/utils/date.js'
import { ref } from 'vue'

defineOptions({
  name: 'DashboardTable',
})

const loading = ref(true)
const dataTimeline = ref([])

const loadCommits = () => {
  Commits(0).then(({ data }) => {
    loading.value = false
    data.forEach((element, index) => {
      if (element.commit.message && index < 10) {
        dataTimeline.value.push({
          from: formatTimeToStr(element.commit.author.date, 'yyyy-MM-dd'),
          title: element.commit.author.name,
          showDayAndMonth: true,
          message: element.commit.message,
        })
      }
    })
  })
}

loadCommits()
</script>

<style lang="scss" scoped>
.commit-table{
    background-color: #fff;
    height: 400px;
    &-title{
        font-weight: 600;
        margin-bottom: 12px;
    }
    .log{
      &-item{
        display: flex;
        justify-content: space-between;
        margin-top: 14px;
        .key-box{
          justify-content: center;
        }
        .key{
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F0F2F5;
          text-align: center;
          color:rgba($color: #000000, $alpha: 0.65);
          &.top{
            background: #314659;
            color: #FFFFFF;;
          }

        }
        .message{
          color: rgba(0, 0, 0, 0.65);
        }
        .form{
          color: rgba(0, 0, 0, 0.65);
          margin-left: 12px;
        }
        .flex{
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .flex-1{
          flex:1;
        }
        .flex-2{
          flex:2;
        }
        .flex-3{
          flex:3;
        }
        .flex-4{
          flex:4;
        }
        .flex-5{
          flex:5;
        }
      }
    }
}
</style>
