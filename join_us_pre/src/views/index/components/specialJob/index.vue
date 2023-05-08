<template>
  <div class="hotjob-container">
    <p class="title">精选职位</p>
    <indexJob :hotJobList="specialJobList" />
  </div>
</template>

<script setup lang="ts">
import indexJob from "@/components/common/indexJob/index.vue";
import { ref } from "vue";
import { Iposition_type, IPositionType } from "@/types/jobType";
import { getPositionByHot } from "@/api";
//精选职位列表
const specialJobList = ref<Iposition_type[]>([]);
const position_type_list: Array<IPositionType> = JSON.parse(
  localStorage.getItem("positionType")!
).positionTypeList;
// 首次获取热门职位列表
getPositionByHot(position_type_list[0].position_type_id).then((res: any) => {
  if (res.code === 200) {
    specialJobList.value = res.data;
  }
});
</script>

<style lang="less" scoped>
.hotjob-container {
  width: 1200px;
  min-height: 750px;
  margin: 50px auto 0;

  .title {
    width: 200px;
    height: 80px;
    font-size: 25px;
    font-weight: bold;
    color: var(--themeColor);
    margin: 10px auto;
    text-align: center;
    line-height: 80px;
  }

  .job-type {
    width: 1200px;
    height: 40px;
    display: flex;
    border-bottom: 1px solid #888;
    font-size: 18px;
    line-height: 40px;
    justify-content: space-evenly;

    li {
      text-align: center;
      width: 100px;

      &.on {
        border-bottom: 3px solid var(--themeColor);
      }
    }
  }
}
</style>
