<template>
  <div class="home">
    <NavBar />
      <!-- <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component"></component>
        </transition>
      </router-view> -->
      <router-view></router-view>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/common/navbar/index.vue";
import Footer from "@/components/common/footer/index.vue";
</script>

<style lang="less" scoped>
.home {
  user-select: none;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s linear;
}
.v-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
