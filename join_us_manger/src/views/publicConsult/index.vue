<template>
  <div class="publicConsult">
    <a-form ref="formRef" size="large" :model="form" :style="{width:'600px'}" @submit="handleSubmit">
    <a-form-item field="name" label="标题"
                 :rules="[{required:true,message:'标题必须填写'},{minLength:6,message:'标题不能少于6个字符'},{maxLength:20,message:'标题不能超过20个字符'}]"
                 :validate-trigger="['change','input']"
    >
      <a-input v-model="form.title" placeholder="请填写资讯标题" />
    </a-form-item>
    <a-form-item field="descs" label="描述"
                 :rules="[{required:true,message:'描述必须填写'},{minLength:8,message:'描述不能少于8字符'},{maxLength:60,message:'标题不能超过60个字符'}]"
                 :validate-trigger="['change','input']"
    >
      <a-input v-model="form.descs" placeholder="请填写资讯描述" />
    </a-form-item>
    <a-form-item field="category" label="分类"
                 :rules="[{required:true,message:'资讯分类必须填写'}]">
    <a-select v-model="form.category"   placeholder="请选择资讯分类">
      <a-option v-for="item in consultCategoryData" :key="item.id">{{ item.categoryName }}</a-option>
    </a-select>
  </a-form-item>
    <a-form-item>
      <a-space>
        <a-button html-type="submit">Submit</a-button>
        <a-button @click="formRef.resetFields()">Reset</a-button>
      </a-space>
    </a-form-item>
  </a-form>
    <div class="editor">
      <MdEditor v-model="text" @onUploadImg="onUploadImg" :toolbars="toolbars" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import Axios from "axios"
import {uploadPhotoUrl} from "@/api/upload"
import { toolbars } from "./toolbars";
import {Message} from '@arco-design/web-vue'
import {useConsultStore} from  "@/store/consult"
const {consultCategoryData} = useConsultStore()
const formRef = ref()
const text = ref("# Hello Editor");
const form = reactive({
  author_id:'',
  title:'',
  descs:'',
  cover_img:'',
  category:'',
})

const handleSubmit = ({values, errors}) => {
      console.log('values:', values, '\nerrors:', errors)
    }
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("photo", file);
        Axios
          .post(uploadPhotoUrl, form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if(res.data.code!==200){
              return Message.error(res.data.msg)
            }else{
              rev(res)
            }
          })
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => item.data.url));
};
</script>

<style lang="less" scoped></style>
