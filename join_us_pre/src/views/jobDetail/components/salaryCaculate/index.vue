<template>
    <div class="salary-caculate-container">
        <p>工资计算器</p>
        
    </div>
</template>

<script setup lang="ts">
const inputSalary = ref(0)
</script>

<style lang="less" scoped>
.salary-caculate-container{
    width: 350px;
    height: 200px;
    border-radius: 20px;
    border: 1px solid var(--themeColor);
    background: linear-gradient(to bottom, var(--themeColor) 50%, #fff 100%);
    p{
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
    }
}
</style>