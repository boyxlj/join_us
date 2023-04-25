<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useJobTypeStore } from "@/store/positionType";
// import { jobDetailStore } from "@/store/jobDetail";
import { useHotSearchPosition } from "@/store/position";
// const job = jobDetailStore();
const jobType = useJobTypeStore();
const hotSearchPosition = useHotSearchPosition()
// job.jobListAction();
jobType.getJobs();
hotSearchPosition.getData()
</script>

<style scoped></style>
