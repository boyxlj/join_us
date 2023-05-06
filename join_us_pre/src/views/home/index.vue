<template>
  <div class="home">
    <NavBar />
    <router-view v-slot="{ Component }">
      <transition  name="view">
          <component :is="Component"></component>
      </transition>
    </router-view>
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
.view-enter-from,
.view-leave-to {
  opacity: 0;
}
.view-enter-to,
.view-leave-from {
  opacity: 1;
  transition: all .5s ease;
}
</style>
