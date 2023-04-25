<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useJobTypeStore } from "@/store/positionType";
import { useHotSearchPosition } from "@/store/position";
const jobType = useJobTypeStore();
const hotSearchPosition = useHotSearchPosition()
jobType.getJobs();
hotSearchPosition.getData()
</script>

<style scoped></style>
