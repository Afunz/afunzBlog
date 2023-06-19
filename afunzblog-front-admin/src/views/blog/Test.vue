<template>
  <div>
    <EditorHtml :modelValue="markdownContent"></EditorHtml>
    {{ markdownContent }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
const markdownContent = ref("# test")


</script>

<style lang="scss" scoped>
</style>
