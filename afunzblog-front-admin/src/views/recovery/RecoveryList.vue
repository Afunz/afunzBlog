<template>
  <div class="body">
    <div class="top-panel">
    <el-form :model="searchFormData"
              @submit.native.prevent
              class="search-form"
              labelAlign="left">
                <el-row :gutter="5">
                  <el-col :span="5">
                    <el-form-item label="标题">
                    <el-input v-model="searchFormData.titleFuzzy" placeholder="支持模糊搜索" allowClear @keyup.enter.native="loadDataList">
                    </el-input>
                  </el-form-item>
                  </el-col>
                  <el-col :span="5" :style="{'padding-left' : '10px'}">
                    <el-form-item>
                      <el-button type="primary" @click="loadDataList">搜索</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>  
          </el-form>
      </div>
      <Table :columns="columns"
           :showPagination="true"
           :dataSource="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           >
           <!-- 封面 -->
           <template #cover="{index,row}">
            <div class="cover">
              <Cover :cover="row.cover"></Cover>
            </div>
           </template>
           <!-- 文章信息 -->
           <template #blogInfo="{index,row}">
            <div>标题：{{ row.title }}</div>
            <div>文章类型：{{ row.blogType == 0 ? '博客':'专题' }}</div>
              <el-divider direction="vertical" /><span>{{ row.blogType == 0 ? '分类':'专题' }}</span>
              {{ row.categoryName || '--' }}
            <div>作者：{{ row.nickName }}</div>
           </template>
           <!-- 类型 -->
           <template #typeName="{index,row}">
            <div>类型：<span v-if="row.type==0">原创</span><span v-if="row.type==1">转载</span></div>
            <div v-if="row.type==1">转载地址：{{ row.reprintUrl }}</div>
           </template>
            <!-- 状态 -->
            <template #status="{index,row}">
            <div>
              <span :style="{color:row.status == 1? 'green':'red'}">{{ row.statusName }}</span>
            </div>
           </template>
           <!-- 时间 -->
           <template #timeInfo="{index,row}">
            <div>创建时间：{{ row.createTime }}</div>
            <div>更新时间：{{ row.lastUpdateTime }}</div>
           </template>
           <template #operation="{index,row}">
           <template v-if="row.userId == userInfo.userId || userInfo.roleType == 1">
              <a href="javascript:void(0)" class="a-link" @click="reductionBlog(row)">还原</a>
              <el-divider direction="vertical"></el-divider>
              <a href="javascript:void(0)" class="a-link" @click="delBlog(row)">删除</a>
          </template>
           <span v-else>--</span>
           </template>
    </Table>
  </div>
</template>

<script setup>
import { getCurrentInstance,ref,reactive,nextTick } from 'vue'
const { proxy } = getCurrentInstance();
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route  = useRoute()

const api ={
  'loadDataList':'/blog/loadRecoveryList',
  'delBlog':'/blog/delBlog',
  'recoveryBlog':'/blog/reductionBlog'
}

const userInfo = reactive({ roleType:1 })

const tableData = reactive({})
const tableOptions = reactive({
  extHeight: 50,
})

//列表
const columns = [{
  label:'封面',
  prop:'cover',
  width:150,
  scopedSlots:'cover'
},
{
  label:'文章信息',
  prop:'title',
  width:300,
  scopedSlots:'blogInfo'
},
{
  label:'编辑器',
  prop:'editorTypeName',
  width:250,
},
{
  label:'评论',
  prop:'allowCommentTypeName',
  width:250,
},
{
  label:'时间',
  prop:'createTime',
  scopedSlots:'timeInfo',
  width:280
},
{
  label:'操作',
  prop:'operation',
  width:150,
  scopedSlots:'operation'
}
]

const searchFormData = reactive({})
const loadDataList =async ()=>{
    let params={
      pageNo:tableData.pageNo,
      pageSize:tableData.pageSize
    }

    Object.assign(params,searchFormData)

      let result = await proxy.request({
        url:api.loadDataList,
        params
      })
      if(!result){
        return
      }
      Object.assign(tableData,result.data)
}


//删除博客
const delBlog = (data)=>{
  console.log(data);
  proxy.Confirm(`你确定要删除${data.title}吗,删除后无法找回`,async ()=>{
    let result = await proxy.request({
      url: api.delBlog,
      params:{
        blogId: data.blogId
      }
    })
    if(!result){
      return
    }
    proxy.message.success("删除成功")
    loadDataList();
  })
}

const reductionBlog = (data) =>{
  proxy.Confirm(`确定要恢复${data.title}吗?恢复后博客为草稿状态`,async ()=>{
    let result = await proxy.request({
      url: api.recoveryBlog,
      params:{
        blogId: data.blogId
      }
    })
    if(!result){
      return
    }
    proxy.message.success("恢复成功")
    loadDataList();
  })
}
</script>

<style lang="scss" scoped>
</style>
