
<template>
  <router-view></router-view>
</template>


<script setup lang="ts">
import {useConsultStore} from "@/store/consult"

useConsultStore().getConsultCategory()
</script>
