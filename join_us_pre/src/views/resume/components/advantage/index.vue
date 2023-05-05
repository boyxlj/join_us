<template>
  <div class="advantage">
    <div class="title">编辑个人优势</div>
    <a-textarea
      v-model:value="textareaValue"
      placeholder="请填写您的个人优势"
      :rows="7"
      showCount
      :maxlength="200"
    />
    <div class="btns">
      <a-button :disabled="!textareaValue.length" @click="cancel">取消</a-button>
      <a-button :disabled="!textareaValue.length" class="ok" type="primary" @click="ok">完成</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import {useUserInfo} from "@/store/user"
const userStore = useUserInfo()
const textareaValue = ref("");
const props =  withDefaults(defineProps<{changeAdvantageForm:any,userInfo:any}>(),{})
onMounted(()=>{
  textareaValue.value = props.userInfo.advantage
})
const cancel = ()=>{
  if(!textareaValue.value) return message.warning("请填写个人优势")
  props.changeAdvantageForm()
}
const ok = async()=>{
  if(!textareaValue.value) return message.warning("请填写个人优势")
  //发送请求
  const res =await userStore.updateUseInfo({advantage:textareaValue.value})
  if(res===200){
     props.changeAdvantageForm()
};

}
</script>

<style lang="less" scoped>
.advantage {
  width: 100%;
  min-height: 200px;
  background: #f8f9fb;
  padding: 15px 20px;
  box-sizing: border-box;
  .title{
   margin-bottom: 12px;
  }
  ::v-deep(.ant-input) {
    border-radius: 0;
  }
  .btns{
    margin: 40px 0 20px;
    display: flex;
    width: 100%;
    justify-content: flex-end;
    ::v-deep(.ant-btn){
      border-radius: 0;
    }
    ::v-deep(.ant-input-textarea-show-count::after ){
      color: red;
    }
    .ok{
      margin-left: 15px;
    }
  }
}
</style>
