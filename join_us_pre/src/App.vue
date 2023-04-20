<template>
  <div>
    <h1>123</h1>
    <a-button type="primary">Primary Button</a-button>
    <button @click="num++">{{num}}</button>
  </div>
</template>

<script setup lang="ts">
const num = ref(0)
</script>

<style scoped></style>
