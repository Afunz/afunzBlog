<template>
  <div>
    <div class="container">
        <div class="left">
          <div class="blog-list">
          <div v-for="item in blogInfo.list">
            <BlogItem :data="item" ></BlogItem>
          </div>
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
        <!-- 用户 -->
        <div class="part-title">
          <span class="title">博客成员</span>
          <router-link to="/user" class="a-link">更多&gt;&gt;</router-link>
        </div>
        <div class="user-list">
          <div v-for="item in userList" >
           <UserItem :avatar="item.avatar"
                        :nickName="item.nickName"
                        :profession ="item.profession"
                        :count="item.blogCount"
                        :userId="item.userId"></UserItem>
          </div>
        </div>
        <!-- 专题 -->
        <div class="part-title">
          <span class="title">专题</span>
          <router-link to="/special" class="a-link">更多&gt;&gt;</router-link>
        </div>
        <div class="category-list">
          <div v-for="item in specialList" >
           <CategoryItem :data="item" :type="1"></CategoryItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();


const api = {
  'loadBlogList':'/view/loadBlogList',
  'loadCategory':'/view/loadCategory',
  'loadSpecial':'/view/loadSpecial',
  'loadTeamUser':'/view/loadTeamUser'
}
const RIGHT_PAGE_SIZE = 5

//博客列表
const blogInfo =ref([])
const blogPageInfo = ref({})


const loadDataList = async (pageNo) => {
  let result =await proxy.request({
    url: api.loadBlogList,
    params:{
      pageNo
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
      pageSize:RIGHT_PAGE_SIZE
    }
  })
  if(!result){
    return
  }
  categoryList.value = result.data
}
loadCategoryList()


//专题
const specialList = ref([])
const loadSpecialList = async () => {
  let result =await proxy.request({
    url: api.loadSpecial,
    params:{
      pageNo:1,
      pageSize:RIGHT_PAGE_SIZE
    }
  })
  if(!result){
    return
  }
  specialList.value = result.data.list
}
loadSpecialList()


//用户列表
const userList = ref([])
const loadUserList = async () => {
  let result =await proxy.request({
    url: api.loadTeamUser,
    params:{
      pageSize:RIGHT_PAGE_SIZE
    }
  })
  if(!result){
    return
  }
  userList.value = result.data
}
loadUserList()
</script>

<style lang="scss" scoped>

</style>
