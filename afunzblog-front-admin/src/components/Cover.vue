<template>
  <div class="cover">
    <img :src="proxy.globalInfo.imageUrl+cover" v-if="cover">
    <img src="../assets/blogger.png" alt="" v-else>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive } from "vue";
const { proxy } = getCurrentInstance();
const props =defineProps({
  cover:{
    type: String
  }
})
</script>

<style lang="scss" scoped>
.cover{
  // background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  overflow: hidden;
  img{
    width: 100%;
  }
}
</style>
