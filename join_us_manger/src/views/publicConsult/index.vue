<template>
  <div class="publicConsult">
    <div class="editor">
      <MdEditor
       v-model="text"
       :toolbars="toolbars"
         />
    </div>
  </div>
</template>

<script setup lang="ts">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {toolbars} from "./toolbars"
const text = ref('# Hello Editor');

</script>

<style lang="less" scoped></style>
