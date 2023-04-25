<template>
  <div class="empty" :style="{backgroundColor:bg,height:height+'px'}">
    <slot name="photo">
      <img src="../../../assets/images/empty.png" alt="" />
    </slot>
      <p :style="{color:color}">{{ msg }}</p>
  </div>
</template>

<script setup lang="ts">
type TEmpty = {
  msg?:string,
  bg?:string,
  color?:string,
  height?:number,
}
withDefaults(defineProps<TEmpty>(),{
  msg:'没有找到相关职位，修改筛选条件试一下',
  bg:'#fff',
  color:'#999',
  height:360
})
</script>

<style lang="less" scoped>
.empty {
  width: 100%;
  height: 360px;
  background: #fff;
  border-radius: var(--radiusSize);
  padding: 100px 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  img {
    width: 200px;
    height: 122px;
  }
  p {
    text-align: center;
    font-size: 16px;
    color: #999;
    font-weight: 200;
    line-height: 22px;
    margin-top: 16px;
  }
}
</style>
