<template>
  <div class="user-item">
    <div class="avatar">
      <img :src="proxy.globalInfo.imageUrl+avatar" v-if="avatar">
      <img src="../assets/blogger.png" v-else>
    </div>
    <div class="nick-name">
      <router-link :to="'/user#'+userId" class="a-link">{{ nickName }}</router-link>  
      <div class="profession">{{ profession }}</div>
    </div>
    <div class="count">{{ count }}篇</div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  avatar:{
    type:String
  } ,
  nickName:{
    type:String
  },
  profession:{
    type:String
  },
  count:{
    type:Number,
    default:0
  },
  userId:{
    type:Number,
  },
})
</script>

<style lang="scss" scoped>
.user-item{
  display: flex;
  padding: 10px 0;
  align-items: center;
  .avatar{
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .nick-name{
    flex: 1;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 8px;
    font-size: 14px;
    .a-link{
      color: #494949;
      font-weight: bold;
    }
    .profession{
      font-size: 13px;
      color: #999aaa;
      margin-top: 5px;
    }
  }
  .count{
    width: 30px;
    font-size: 13px;
    color: #999aaa;
  }
}
</style>