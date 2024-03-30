<template>
  <router-view v-slot="{ Component }">
    <transition name="view">
      <a-config-provider :locale="zhCN">
        <component :is="Component"></component>
      </a-config-provider>
    </transition>
  </router-view>
  <!-- <router-view></router-view> -->
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useJobTypeStore } from '@/store/positionType'
import { useHotSearchPosition } from '@/store/position'
import { useConsult } from '@/store/consult'
import { useCity } from '@/store/city'
import { useSwiperStore } from '@/store/swiper'
import { useIndustryStore } from '@/store/industry'
dayjs.locale('zh-cn')
const { preventCity } = useCity()
const mangerToken = localStorage.getItem('mangerToken')
useJobTypeStore().getJobs() //职位类型
useIndustryStore().getIndustry() //行业
useCity().getCity()

if (!mangerToken) {
  useSwiperStore().getSwiper() //轮播
  useHotSearchPosition().getData(preventCity) //热招职位
  useHotSearchPosition().getSortOrRandomData(preventCity) //热招职位
  useConsult().getConsultCategory() //资讯分类
}
</script>

<style scoped>
.view-enter-from,
.view-leave-to {
  opacity: 0;
}
.view-enter-to,
.view-leave-from {
  opacity: 1;
  transition: all 0.5s ease;
}
</style>
