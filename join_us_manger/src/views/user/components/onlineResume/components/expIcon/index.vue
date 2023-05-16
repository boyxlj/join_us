<template>
    <div>
        <expIcon type="icon-jingyan" />
    </div>
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 生日图标
const expIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4055348_wxx1rwzfz6n.js'
})

export default {
    components: {
        expIcon
    }
}
</script>

<style scoped></style>