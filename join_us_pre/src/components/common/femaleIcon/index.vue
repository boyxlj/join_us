<template>
    <div class="female-icon-container">
        <femaleIcon type="icon-gender-female"></femaleIcon>
    </div>
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 性别图标
const femaleIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4030305_zekz8k075n.js'
})

export default {
    components: {
        femaleIcon
    }
}
</script>

<style scoped>
.female-icon-container {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    /* vertical-align: middle; */
    background-color: #ef6ae4;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
}
</style>