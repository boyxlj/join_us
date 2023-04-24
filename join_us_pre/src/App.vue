<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
import {useJobTypeStore} from "@/store/jobType"
import { jobDetailStore } from "@/store/jobDetail";
const job = jobDetailStore();
const jobType  = useJobTypeStore()
  job.jobListAction()
  jobType.getJobs()
</script>

<style scoped></style>
