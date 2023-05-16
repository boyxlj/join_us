<template>
    <div>
        <birthcakeIcon type="icon-dangaoyuding" />
    </div>
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 生日图标
const birthcakeIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4055348_wxx1rwzfz6n.js'
})

export default {
    components: {
        birthcakeIcon
    }
}
</script>

<style scoped>

</style>