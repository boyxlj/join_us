<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useJobTypeStore } from "@/store/positionType";
import { useHotSearchPosition } from "@/store/position";
import { useCity } from "@/store/city";
const jobType = useJobTypeStore();
const hotSearchPosition = useHotSearchPosition()
const {preventCity} = useCity()
jobType.getJobs();  //职位类型
hotSearchPosition.getData(preventCity)  //热招职位
hotSearchPosition.getSortOrRandomData(preventCity)  //热招职位
</script>

<style scoped></style>
