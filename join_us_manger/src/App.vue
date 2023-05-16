
<template>
  <router-view></router-view>
</template>


<script setup lang="ts">
import {useConsultStore} from "@/store/consult"
import {useIndustryStore} from "@/store/industry"
import { usePositionTypeStore } from "@/store/positionType";
// import { useHotSearchPosition } from "@/store/position";
import { useCity } from "@/store/city";
// const jobType = useJobTypeStore();
// const hotSearchPosition = useHotSearchPosition();

useCity()
usePositionTypeStore().getPositionTypeShow()  //职位类型一级分类
useIndustryStore().getIndustry()
useConsultStore().getConsultCategory()   //资讯
// jobType.getJobs(); //职位类型
// hotSearchPosition.getData(preventCity); //热招职位
// hotSearchPosition.getSortOrRandomData(preventCity); //热招职位
</script>
