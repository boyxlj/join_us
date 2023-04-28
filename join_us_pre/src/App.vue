<template>
    <!-- <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component"></component>
      </transition>
    </router-view> -->
    <router-view></router-view>
</template>

<script setup lang="ts">
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { useJobTypeStore } from "@/store/positionType";
import { useHotSearchPosition } from "@/store/position";
import { useCity } from "@/store/city";
const jobType = useJobTypeStore();
const hotSearchPosition = useHotSearchPosition();
const { preventCity } = useCity();
jobType.getJobs(); //职位类型
hotSearchPosition.getData(preventCity); //热招职位
hotSearchPosition.getSortOrRandomData(preventCity); //热招职位
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}
.v-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
