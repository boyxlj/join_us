<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
import {useJobTypeStore} from "@/store/jobType"
import { jobDetailStore } from "@/store/jobDetail";
const job = jobDetailStore();
const store  = useJobTypeStore()
store.getJobs()
job.jobListAction()
</script>

<style scoped></style>
