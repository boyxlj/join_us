<template>
  <div class="hotjob-container">
    <p class="title">热招职位</p>
    <ul class="job-type" ref="lis">
      <li @click="changeTab(item.position_type_id, index)" v-for="(item, index) in typeList" :class="index === 0 ? 'on': ''" :key="item.position_type_id">{{ item.position_type_name }}</li>
    </ul>
    <indexJob  :hotJobList="hotJobList"/>
  </div>
</template>

<script setup lang="ts">
import indexJob from '@/components/common/indexJob/index.vue'
import { ref } from "vue";
const router = useRouter();
const lis = ref<HTMLElement>();
const cardContainer = ref();
import { Iobj, IPositionType, Iposition_type } from '@/types/jobType'
import { getPositionByHot } from '@/api'
import { useJobTypeStore } from '@/store/positionType'
const typeStore = useJobTypeStore()
//热门职位列表
const hotJobList = ref<Iposition_type[]>([])
// tab栏列表
const typeList = computed(() => {
  const arr = typeStore.positionTypeList.map((item: IPositionType) => {
    return {
      position_type_id: item.position_type_id,
      position_type_name: item.position_type_name
    }
  })
  return arr.filter(item => !item.position_type_name.includes('/')).slice(0, 9)
})
// 首次获取热门职位列表
getPositionByHot(typeList.value[0].position_type_id).then((res: any) => {
  if (res.code === 200) {
    hotJobList.value = res.data
  }
})
// tab栏切换
const changeTab = (position_type_id: string, index: number) => {
  Array.from(lis.value!.children).forEach((item: any) => {
    if (item.className.includes('on')) {
      item.classList.remove('on')
    }
  })
  lis.value!.children[index].classList.add('on')
  getPositionByHot(position_type_id).then((res: any) => {
    if (res.code === 200) {
      hotJobList.value = res.data
    }
  })
}
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
    border-bottom: 1px solid #e6e6e6;
    font-size: 18px;
    line-height: 40px;
    justify-content: space-between;
    padding: 0 30px;
    
    li {
      cursor: pointer;
      text-align: center;
      color: #666;
      font-size: 16px;
      transition: color .2s linear;
      &:hover{
        color: var(--themeColor);
      }

      &.on {
        color: var(--themeColor);
        border-bottom: 3px solid var(--themeColor);
      }
    }
  }
}
</style>
