<template>
  <div class="special-body">
    <div class="left">
      <div class="special-info">
        <div class="cover">
          <img :src="proxy.globalInfo.imageUrl+specialInfo.cover" v-if="specialInfo.cover">
          <img src="../assets/blogger.png" v-else>
        </div>
        <div class="special-panel">
          <div>{{ specialInfo.categoryName }}</div>
          <div class="count-info">文章数：{{ specialInfo.blogCount }}</div>
        </div>
      </div>
      <div class="desc">简介：{{ specialInfo.categoryDesc }}</div>
      <div class="blog-tree">
        <el-tree
            ref="treeRef"
            node-key="blogId"
            class="filter-tree"
            :data="blogList"
            :props="defaultProps"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="getBlogDetail"
          />
      </div>
    </div>
    <div class="right">
      <div v-html="blogInfo.content" class="content" id="content"></div>
      <div class="toc-list" :style="{left:(rightMarginLeft-scrollBarWith)+'px'}">
        <!-- 目录结构 -->
            <el-collapse v-model="activeToc" >
              <el-collapse-item title="目录结构" name="toc">
              <div v-if="tocArray.length==0" class="no-toc">
                暂无目录
              </div>
              <div v-else class="toc-content">
                <div  v-for="item in tocArray">
                <div class="toc-item" :style="{'padding-left':((item.level-1)*15+5)+'px'}">
                 <a :href="'#'+item.id">{{ item.title }}</a> 
                </div>
                </div>
              </div>
              
            </el-collapse-item>
            </el-collapse>
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
const treeRef = ref()
const categoryId = route.params.specialId

//滚动条的宽度
const scrollBarWith = ref(0)
const rightMarginLeft = ref(1350 - 300+(window.innerWidth-1350)/2 )
const api = {
  'getSpecialDetail':'/view/getSpecialDetail',
  'getBlogDetail':'/view/getBlogDetail',
}
const activeToc =ref(['toc'])
const specialInfo = ref({})
const blogList = ref([])

const loadSpecialInfo = async () => {
  let result = await proxy.request({
    url:api.getSpecialDetail,
    params:{
      categoryId:categoryId
    }
  })
  if(!result){
    return
  }
  specialInfo.value = result.data.blogCategory
  blogList.value = result.data.blogList
  const firstBlogId = result.data.blogList[0].blogId
  //默认选中第一个
  nextTick(()=>{
    treeRef.value.setCurrentKey(firstBlogId)
  })
  
  getBlogDetail({blogId:firstBlogId})
}
loadSpecialInfo()
const defaultProps = {
  children: 'children',
  label: 'title',
}

//获取博客详情
const blogInfo = ref({})
const getBlogDetail =async (node) => {
  let result =await proxy.request({
    url: api.getBlogDetail,
    params:{
      blogId:node.blogId
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
    createToc()

    //判断是否有滚动条
    let hasScrillBar = document.body.scrollHeight > window.innerHeight
    if(hasScrillBar){
      scrollBarWith.value = 4
    }
  })
}


//目录
const tocArray = ref([])
const createToc = () => {
  const tocTags = ["H1","H2","H3","H4","H5","H6"]
  let contentDom = document.querySelector("#content")
  const childNodes = contentDom.childNodes
  tocArray.value = []
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
.special-body{
  background-color: #fff;
  overflow: hidden;
  .left{
    width: 300px;
    float: left;
    .special-info{
      display: flex;
      padding: 5px;
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
        .special-panel{
          margin-left: 3px;
          .count-info{
            margin-top: 5px;
            font-size: 14px;
            color: #919da9;
          }
        }
    }
    .desc{
      font-size: 14px;
      padding: 0px 5px 10px 5px;
      border-bottom: 1px solid #ddd;
    }
    .blog-tree{
      padding: 0px 3px;
      margin-top: 5px;
    }
  }
  .right{
    position: relative;
    margin-left: 300px;
    border-left: 1px solid #ddd;
    padding: 10px;
    min-height: calc(100vh - 150px);
    #content{
      width: 100%;
      overflow: auto;
      line-height: 26px;
      word-break: break-all;
    img{
      width: 100%;
    }
      code{
        max-width: 100%;
        overflow: auto;
      }
    }
    .toc-list{
      z-index: 1000;
      border: 1px solid #ddd;
      position: fixed;
      top: 90px;
      right: 0;
      width: 300px;
      // padding: 10px 5px;
      ::v-deep .el-collapse-item__content{
        padding-bottom: 0px !important;
      }
      .no-toc{
        border-top: 1px solid #ddd;
          text-align: center;
          color: #5f6471;
     }
     .toc-content{
      border-top: 1px solid #ddd;
      max-height: 500px;
      overflow: auto;
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
