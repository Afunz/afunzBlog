<template>
  <div class="category-body">
    <div class="category-list">
      <CategoryItemList v-for="item in specialInfo.list" :data="item" :type="1"></CategoryItemList>
    </div>
    <div class="pagination">
      <el-pagination v-if="specialInfo.totalCount"
                   background 
                   :total="specialInfo.totalCount" 
                   :current-page.sync="specialInfo.pageNo" 
                   :page-size="specialInfo.pageSize"
                   @current-change="handlePageNoChange" 
                   layout="total,prev,pager,next"
                   style="text-align:right"
                   ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  'loadSpecial':'/view/loadSpecial',
}
const RIGHT_PAGE_SIZE = 5

//分类列表
const specialInfo= ref({})
const loadSpecialList = async (pageNo) => {
  let result =await proxy.request({
    url: api.loadSpecial,
    params:{
      pageSize:RIGHT_PAGE_SIZE,
      pageNo:pageNo
    }
  })
  if(!result){
    return
  }
  specialInfo.value = result.data
}
loadSpecialList(1)

//分页切换
const handlePageNoChange = (pageNo) => {
  loadSpecialList(pageNo)
}
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
