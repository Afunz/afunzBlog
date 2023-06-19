<template>
  <div>
    <el-dialog :model-value="show"
               :show-close="false"
               :draggable="true"
               :close-on-click-modal="false"
               :title="title"
               :showClose="showClose"
               class="cust-dialog"
               :showCancel="showCancel"
               :top="top"
               :width="width"
               @close="close"
               >
               <div class="dialog-body">
                <slot></slot>
               </div>
               <template v-if="buttons && buttons.length>0 || showCancel">
                <div class="dialog-footer">
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
  </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const props = defineProps({
  title:{
    type:String,
  },
  show:{
    type: Boolean,
    default: false
  },
  showClose:{
    type: Boolean,
    default: true,
  },
  showCancel:{
    type: Boolean,
    default: true
  },
  top:{
    type:String,
    default:'50px'
  },
  width:{
    type:String,
    default:'30%'
  },
  buttons:{
    type: Array
  }
})

const emit = defineEmits();
const close = ()=>{
  emit("close")
}

</script>

<style lang="scss" scoped>
.cust-dialog{
  .el-dialog__body{
    border-top: 1px solid #ddd;
  }
  .dialog-body{
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    min-height: 80px;
  }
  .dialog-footer{
    margin-top: 20px;
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
