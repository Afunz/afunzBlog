<template>
  <div class="category-item">
    <div class="cover">
      <img :src="proxy.globalInfo.imageUrl+data.cover" v-if="data.cover">
      <img src="../assets/blogger.png" v-else>
    </div>
    <div class="name">
      <router-link :to="'/category/'+data.categoryId" class="a-link" v-if="type ==0">{{ data.categoryName }}</router-link>  
      <router-link :to="'/special/'+data.categoryId" class="a-link" v-else>{{ data.categoryName }}</router-link>  
    </div>
    <div class="count">{{ data.blogCount }}篇</div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  data:{
    type:Object
  },
  type:{
    type:Number,
    default:0
  }
})
</script>

<style lang="scss" scoped>
.category-item{
  display: flex;
  padding: 10px 0;
  align-items: center;
  .cover{
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  .name{
    flex: 1;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 5px;
    font-size: 14px;
  }
  .count{
    width: 30px;
    font-size: 13px;
    color: #999aaa;
  }
}
</style>
