<template>
    <div>
        <stateIcon type="icon-lizhi" />
    </div>
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
// 生日图标
const stateIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4055348_wxx1rwzfz6n.js'
})

export default {
    components: {
        stateIcon
    }
}
</script>

<style scoped></style>