<template>
  <div class="category-body">
    <div class="category-list">
      <CategoryItemList v-for="item in categoryList" :data="item"></CategoryItemList>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  'loadCategory':'/view/loadCategory',
}
const RIGHT_PAGE_SIZE = 5

//分类列表
const categoryList = ref([])
const loadCategoryList = async () => {
  let result =await proxy.request({
    url: api.loadCategory,
    params:{
      pageSize:RIGHT_PAGE_SIZE
    }
  })
  if(!result){
    return
  }
  categoryList.value = result.data
}
loadCategoryList()
</script>

<style lang="scss" scoped>
.category-body{
  background-color: #fff;
  padding: 10px;
  .category-list{
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
