<template>
  <div>
    <div class="container">
        <div class="category-detail">
  
            <CategoryItemList :data="categoryData"></CategoryItemList>
    
          <div class="blog-list">
          <div v-for="item in blogInfo.list">
            <BlogItem :data="item" ></BlogItem>
          </div>
          <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-if="blogInfo.totalCount"
                   background 
                   :total="blogInfo.totalCount" 
                   :current-page.sync="blogInfo.pageNo" 
                   :page-size="blogInfo.pageSize"
                   @current-change="handlePageNoChange" 
                   layout="total,prev,pager,next"
                   style="text-align:right"
                   ></el-pagination>
    </div>
        </div>
        
      </div>
      
      <div class="right">
        <!-- 分类 -->
        <div class="part-title">
          <span class="title">分类专栏</span>
          <router-link to="/category" class="a-link">更多&gt;&gt;</router-link>
        </div>
        <div class="category-list">
          <div v-for="item in categoryList" >
           <CategoryItem :data="item"></CategoryItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router"
const route = useRoute()

const api = {
  'loadBlogList':'/view/loadBlogList',
  'loadCategory':'/view/loadCategory',
  'getCategory':'/view/getCategory'
}

const categoryId = ref(route.params.categoryId)
console.log(categoryId.value);
const RIGHT_PAGE_SIZE = 5

//博客列表
const blogInfo =ref([])
const blogPageInfo = ref({})


const loadDataList = async (pageNo) => {
  let result =await proxy.request({
    url: api.loadBlogList,
    params:{
      pageNo,
      pageSize:5,
      categoryId:categoryId.value
    }
  })
  if(!result){
    return
  }
  console.log(result.data);
  blogInfo.value = result.data
}
loadDataList()
//分页切换
const handlePageNoChange = (pageNo) => {
  loadDataList(pageNo)
}

//分类列表
const categoryList = ref([])
const loadCategoryList = async () => {
  let result =await proxy.request({
    url: api.loadCategory,
    params:{
      pageSize:RIGHT_PAGE_SIZE,
    }
  })
  if(!result){
    return
  }
  categoryList.value = result.data
}
loadCategoryList()


//获取分类详情
const categoryData = ref({})
const getCategoryDetail = async () => {
  let result =await proxy.request({
    url: api.getCategory,
    params:{
      categoryId:categoryId.value
    }
  })
  if(!result){
    return
  }
  categoryData.value = result.data
}
getCategoryDetail()
</script>

<style lang="scss" scoped>
.category-detail{
  flex: 1;
  .category-item-list{
    width: 100%;
    ::v-deep .item-inner{
      border: none;
      padding: 0px;
    }
    background: #fff;
  }
  .blog-list{
    margin-top: 15px;
    background: #fff;
    padding: 15px;
    .pagination{
    margin-top: 15px;
    }
  }
}
</style>
