<template>
  <div class="consult">
    <a-button type="primary" @click="navigatePublicConsult">发布资讯</a-button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const navigatePublicConsult = ()=>{
  router.push('/public/consult')
}
</script>

<style lang="less" scoped></style>
