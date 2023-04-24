<template>
    <div class="salary-caculate-container">
        <p>工资计算器</p>
        <a-input-number v-model:value="salaryNum" class="salary-input" placeholder="请输入工资"></a-input-number>
        <span style="position: absolute; right: 40px; top: 65px;font-weight: bold; color: var(--themeColor);">元</span>
        <a-button @click="salaryCaculateDialog" class="btn">开始计算</a-button>
        <a-modal v-model:visible="visible" title="薪资计算器" @ok="handleOk">
            <a-spin size="large" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
const inputSalary = ref<number>(0)
const salaryNum = ref(0);
const visible = ref(false)
const salaryCaculateDialog = () => {
    visible.value = !visible.value
}
const handleOk = () => {
    visible.value = false
}
</script>

<style lang="less" scoped>
.salary-caculate-container {
    width: 350px;
    height: 200px;
    border-radius: 20px;
    border: 1px solid var(--themeColor);
    background: linear-gradient(to bottom, var(--themeColor) 50%, #fff 100%);
    text-align: center;
    position: relative;

    p {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
    }

    .salary-input {
        width: 300px;
    }

    .btn {
        margin-top: 30px;
        width: 300px;
        background-color: var(--themeColor);
        color: #fff;
        font-weight: bold;

        &:hover {
            background-color: #8964cf;
        }
    }
}</style>