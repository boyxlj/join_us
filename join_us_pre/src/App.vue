<template>
    <router-view v-slot="{ Component }">
      <transition name="view" >
            <component :is="Component"></component>
        </transition>
    </router-view>
    <!-- <router-view></router-view> -->
</template>

<script setup lang="ts">
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { useJobTypeStore } from "@/store/positionType";
import { useHotSearchPosition } from "@/store/position";
import { useConsult } from "@/store/consult";
import { useCity } from "@/store/city";
const jobType = useJobTypeStore();
const hotSearchPosition = useHotSearchPosition();
const { preventCity } = useCity();
const  consult  = useConsult();
jobType.getJobs(); //职位类型
hotSearchPosition.getData(preventCity); //热招职位
hotSearchPosition.getSortOrRandomData(preventCity); //热招职位
consult.getConsultCategory(); //资讯分类
</script>

<style scoped>
.view-enter-from,.view-leave-to{
  opacity: 0;
}
.view-enter-to,.view-leave-from{
  opacity: 1;
  transition: all .5s ease;
}

</style>
