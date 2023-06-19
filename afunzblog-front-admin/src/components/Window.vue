<template>
  <div class="window" :style="{width:windowWidth+'px'}" v-if="show">
    <div class="title">
      <span class="iconfont icon-back" @click="close" v-if="showCancel"></span>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <template v-if="buttons && buttons.length>0 || showCancel">
                <div class="footer">
                  <el-button link @click="close">
                           取消
                </el-button>
                  <el-button plain="true" v-for="btn in buttons"
                           :type="btn.type"
                           @click="btn.click">
                           {{ btn.text }}
                </el-button>
                </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const windowWidth = window.innerWidth - 200
const props = defineProps({
  buttons:{
    type:Array
  },
  showCancel:{
    type: Boolean,
    default: true
  },
  show:{
    type: Boolean,
    default: false
  },
})

const emit = defineEmits();
const close = ()=>{
  emit("close")
}
</script>

<style lang="scss" scoped>
.window{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: calc(100vh - 70px);
  background: #fff;
  z-index: 50;
  .title{
    height: 30px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .icon-back{
      font-size: 25px;
      cursor: pointer;
    }
  }
  .body{
    height: calc(100vh - 150px);
    padding: 10px;
    overflow: auto;
  }
  .footer{
    border-top: 1px solid #ddd;
    text-align: center;
    line-height: 50px;
  }
}
</style>
