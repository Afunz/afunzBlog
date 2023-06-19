<template>
    <div class="category-item-list">
      <div class="item-inner">
          <div class="cover">
          <img :src="proxy.globalInfo.imageUrl+data.cover" v-if="data.cover">
          <img src="../assets/blogger.png" v-else>
        </div>
        <div class="category-info">
          <div class="name">
            <router-link :to="'/category/'+data.categoryId" class="a-link" v-if="type ==0">{{ data.categoryName }}</router-link>  
            <router-link :to="'/special/'+data.categoryId" class="a-link" v-else>{{ data.categoryName }}</router-link>  
          </div>
          <div class="desc">{{ data.categoryDesc }}</div>
          <div class="count">{{ data.blogCount }}篇</div>
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
  },
  type:{
    type:Number,
    default:0
  }
})
</script>

<style lang="scss" scoped>
.category-item-list{
  display: flex;
  padding: 10px;
  align-items: center;
  width: 25%;
  .item-inner{
    border: 1px solid #ddd;
    width: 100%;
    padding: 10px;
      .cover{
      background: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      overflow: hidden;
      float: left;
      img{
        width: 100%;
      }
    }
    .category-info{
      margin-left: 110px;
      .name{
        flex: 1;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
        font-weight: 600;
      }
      .desc{
        margin-top: 10px;
        font-size: 14px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .count{
        margin-top: 10px;
        width: 30px;
        font-size: 13px;
        color: #999aaa;
      }
    }
  }
  
}
</style>
