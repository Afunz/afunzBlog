<template>
  <div class="container blog-detail">
        <div class="left">
          <div class="title">{{ blogInfo.title }}</div>
          <div class="info">
            <span class="time">{{ blogInfo.createTime }}</span>
            <span class="nick-name">作者：<router-link :to="'/user#'+blogInfo.userId" class="a-link">{{ blogInfo.nickName }}</router-link> </span>
            <span class="category-name">分类专栏：<router-link :to="'/category/'+blogInfo.categoryId" class="a-link">{{ blogInfo.categoryName }}</router-link> </span>
          </div>
          <div v-html="blogInfo.content" class="content" id="content"></div>
        </div>
        <div class="right" :style="{left:(rightMarginLeft-scrollBarWith)+'px'}">
          <!-- 目录结构 -->
          <div class="part-title">
                <span class="title">目录结构</span>
            </div>
            <div class="toc-list">
              <div v-if="tocArray.length==0" class="no-toc">
                暂无目录
              </div>
              <div v-else v-for="item in tocArray">
                <div class="toc-item" :style="{'padding-left':((item.level-1)*15+5)+'px'}">
                 <a :href="'#'+item.id">{{ item.title }}</a> 
                </div>
              </div>
            </div>
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
</template>

<script setup>
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-light.css"
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { useRoute } from "vue-router"
const route = useRoute()
const api = {
  'getBlogDetail':'/view/getBlogDetail',
  'loadCategory':'/view/loadCategory',
}

//滚动条的宽度
const scrollBarWith = ref(0)
const rightMarginLeft = ref(1050+(window.innerWidth-1350)/2)
const RIGHT_PAGE_SIZE = 5
const blogId = ref(route.params.blogId)
const blogInfo = ref({})
const getBlogDetail = async () => {
  let result =await proxy.request({
    url: api.getBlogDetail,
    params:{
      blogId:blogId.value
    }
  })
  if(!result){
    return
  }
  blogInfo.value = result.data
  nextTick(()=>{
    let blocks = document.querySelectorAll("pre code")
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
    //获取目录
    createToc()

    //判断是否有滚动条
    let hasScrillBar = document.body.scrollHeight > window.innerHeight
    if(hasScrillBar){
      scrollBarWith.value = 4
    }
  })
}
getBlogDetail()


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



//目录
const tocArray = ref([])
const createToc = () => {
  tocArray.value=[]
  const tocTags = ["H1","H2","H3","H4","H5","H6"]
  let contentDom = document.querySelector("#content")
  const childNodes = contentDom.childNodes

  let index = 0
  childNodes.forEach(item =>{
    let tagName = item.tagName
    if(tagName == undefined){
      return true
    }
    if(!tocTags.includes(tagName.toUpperCase())){
      return true
    }
    index++
    let id = "toc"+index
    item.setAttribute("id",id)
    tocArray.value.push({
      id:id,
      title:item.innerText,
      level: Number.parseInt(tagName.substring(1))
    })
  })
}


</script>

<style lang="scss" scoped>
.blog-detail{
  .left{
    width: 1040px;
    flex: none;
  }
  .title{
    font-size: 16px;
  }
  .info{
    background: #f4f4f4;
      margin-top: 10px;
      color: #5f6471;
      font-size: 13px;
      padding:15px;
      .time{
        margin-right: 10px;
      }
      .nick-name{
        margin-right: 10px;
      }
    }
  .content{
    margin-top: 15px;
    line-height: 26px;
    word-break: break-all;
    img{
      max-width: 100%;
    }
  }

  .right{
    position: fixed;
    right: 0;
    margin-left: 0px;
    .toc-list{
      padding: 10px 5px;
      .no-toc{
          text-align: center;
          color: #5f6471;
          
     }
     .toc-item{
      font-size: 14px;
      line-height: 25px;
      cursor: pointer;
      a{
        color: #5f6471;
        text-decoration: none;
      }
     }
     .toc-item:hover{
      background: #dbeefa;
     }
    }
  }
}
</style>
