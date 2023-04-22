<template>
   <div class="footer">
    Copyright © 2022-{{ new Date().getFullYear() }}  join-us  All Rights Reserved
   </div>

</template>

<script setup lang="ts">

</script>

<style lang='less' scoped> 
.footer{
  widows: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  // box-shadow:  0 -8px 0 10px #ddd;
  border-top: 1px solid #ddd;
}
</style>