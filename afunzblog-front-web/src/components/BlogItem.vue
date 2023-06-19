<template>
  <div class="blog-item">
    <div class="cover">
      <img :src="proxy.globalInfo.imageUrl+data.cover" v-if="data.cover">
      <img src="../assets/blogger.png" v-else>
    </div>
    <div class="content">
      <div class="title"><router-link :to="'/blog/'+ data.blogId" class="a-link">{{ data.title }}</router-link></div>
      <div class="summary">{{ data.summary }}</div>
      <div class="info">
        <span class="time">{{ data.createTime }}</span>
        <span class="nick-name">作者：<router-link :to="'/user#'+data.userId" class="a-link">{{ data.nickName }}</router-link> </span>
        <span class="category-name">分类专栏：
          <router-link :to="'/category/'+ data.categoryId" class="a-link" v-if="data.categoryId!=null&&data.categoryId!=0">{{ data.categoryName }}</router-link> 
          <router-link to="/category" class="a-link" v-else>{{ data.categoryName }}</router-link> 
        </span>
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
.blog-item{
  display: flex;
  padding: 10px 0px;
  border-bottom: 1px solid #ddd;
  .cover{
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  overflow: hidden;
  img{
    width: 100%;
  }
}
  .content{
    flex:1;
    margin-left: 10px;
    .title{
      color: #1890ff;
    }
    .summary{
      word-break: break-all;
      margin-top: 6px;
      font-size: 14px;
      line-height: 22px;
      white-space: normal;
      color: #999aaa;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .info{
      margin-top: 30px;
      color: #5f6471;
      font-size: 13px;
      .time{
        margin-right: 10px;
      }
      .nick-name{
        margin-right: 10px;
      }
    }
  }
}
</style>
