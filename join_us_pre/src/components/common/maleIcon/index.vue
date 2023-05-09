<template>
    <div class="male-icon-container">
        <maleIcon type="icon-gender-male"></maleIcon>
    </div>
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 性别图标
const maleIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4030305_zekz8k075n.js'
})

export default {
    components: {
        maleIcon
    }
}
</script>

<style scoped>
.male-icon-container{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    /* vertical-align: middle; */
    background-color: #4ba1f1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
}
</style>