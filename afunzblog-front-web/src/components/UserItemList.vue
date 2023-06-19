<template>
  <div class="user-item-list" :id="data.userId">
    <div class="avatar">
      <img :src="proxy.globalInfo.imageUrl+data.avatar" v-if="data.avatar">
      <img src="../assets/blogger.png" v-else>
    </div>
    <div class="user-info">
      <div class="nick-name">{{ data.nickName }}</div>
      <div class="profession">
        <div>职位：{{ data.profession }}</div>
        <div class="blog-count">博客：{{ data.blogCount }}</div>
      </div>
      <div class="introduction" v-html="data.introduction">

      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  data:{
    type:Object
  }
})
</script>

<style lang="scss" scoped>
.user-item-list{
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  .avatar{
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .user-info{
    color: #4f4f4f;
    margin-left: 10px;
    flex: 1;
    .nick-name{
      font-size: 16px;
      font-weight: bold;
    }
    .profession{
      margin-top: 10px;
      display: flex;
      .blog-count{
        margin-left: 10px;
      }
    }
    .introduction{
      margin-top: 10px;
    }
  }
}
</style>
