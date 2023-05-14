<template>
  <div class="publicConsult">
    <a-form
      ref="formRef"
      size="large"
      :model="form"
      :style="{ width: '450px', textAlign: 'center' }"
      @submit="handleSubmit"
    
    >
      <a-form-item
        field="name"
        label="昵称"
        :rules="[
          { required: true, message: '昵称须填写' },
          { minLength: 2, message: '标题不能少于2个字符' },
          { maxLength: 16, message: '标题不能超过16个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.name" placeholder="请填写昵称" />
      </a-form-item>
      <a-form-item
        field="username"
        label="账号"
        :rules="[
          { required: true, message: '登录账号不能为空' },
            { minLength: 6, message: '登录账号最少为6位' },
            { maxLength: 16, message: '登录账号最多为16位' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.username" placeholder="请填写账号" />
      </a-form-item>
      <a-form-item
        field="password"
        label="密码"
        v-if="!itemManger.length"
        :rules="[
          { required: true, message: '登录密码不能为空' },
            { minLength: 6, message: '登录密码最少为6位' },
            { maxLength: 16, message: '登录密码最多为16位' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.password" placeholder="请填写登录密码" />
      </a-form-item>
      <a-form-item
        field="password"
        label="密码"
        v-if="itemManger.length"
        :rules="[
            { minLength: 6, message: '登录密码最少为6位' },
            { maxLength: 16, message: '登录密码最多为16位' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.password" placeholder="请填写登录密码" />
      </a-form-item>
   
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">{{
            itemManger.length ? "提交修改" : "确认添加"
          }}</a-button>
          <a-button @click="cancelPublish">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { IMangerData } from "@/types/manger";
import { useAuth } from "@/hooks/useAuth";
const formRef = ref();
const form = reactive({
  manger_id: '',
  name: "",
  username: "",
  password: "",
});
const props = defineProps<{
  validateForm: any;
  mangerModelVisible: boolean;
  itemManger: IMangerData[];
}>();

watch(
  () => props.itemManger,
  () => {
    if (props.itemManger.length) {
      form.manger_id = props.itemManger[0].manger_id;
      form.name = props.itemManger[0].name;
      form.username = props.itemManger[0].username;
    } else {
      form.manger_id = "";
    }
  }
);


watch(
  () => props.mangerModelVisible,
  () => {
    if (!props.mangerModelVisible) {
      formRef.value.resetFields();
    }
  }
);
const handleSubmit = ({ values, errors }:any) => {
  const resArr = [];
  for (let i in errors) {
    resArr.push(i);
  }
  if (!resArr.length) {
    props.validateForm(true, {
      ...values,
    });
  }
};


const cancelPublish = () => {
  props.validateForm(false);
  formRef.value.resetFields();
};


</script>

<style lang="less" scoped>
.publicConsult {
  position: relative;
  left: 16px;
  .arco-form-item{
    padding-bottom: 4px;
  }
}
</style>
