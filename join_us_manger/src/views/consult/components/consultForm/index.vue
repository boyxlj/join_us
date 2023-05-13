<template>
  <div class="publicConsult">
    <a-form
      ref="formRef"
      size="large"
      :model="form"
      :style="{ width: '1250px', textAlign: 'center' }"
      @submit="handleSubmit"
    >
      <a-form-item
        field="title"
        label="标题"
        :rules="[
          { required: true, message: '标题必须填写' },
          { minLength: 6, message: '标题不能少于6个字符' },
          { maxLength: 20, message: '标题不能超过20个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.title" placeholder="请填写资讯标题" />
      </a-form-item>
      <a-form-item
        field="descs"
        label="描述"
        :rules="[
          { required: true, message: '描述必须填写' },
          { minLength: 8, message: '描述不能少于8字符' },
          { maxLength: 200, message: '标题不能超过200个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-textarea
          :max-length="200"
          show-word-limit
          v-model.trim="form.descs"
          placeholder="请填写资讯描述"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        field="category"
        label="分类"
        :rules="[{ required: true, message: '资讯分类必须填写' }]"
      >
        <a-select v-model="form.category" placeholder="请选择资讯分类">
          <a-option v-for="item in consultCategoryData" :key="item.id">{{
            item.categoryName
          }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="cover_img" label="配图"
      >
        <a-upload
          list-type="picture-card"
          :default-file-list="form.cover_img"
          name="photo"
          image-preview
          @change="uploadChange"
          :limit="1"
          :key="form.cover_img.length"
          :action="uploadPhotoUrl"
        >
        </a-upload>
      </a-form-item>
      <a-form-item
        field="content"
        label="内容"
        :rules="[{ required: true, message: '内容必须填写' }]"
        :validate-trigger="['change', 'input']"
      >
        <div class="editor" style="text-align: left">
          <MdEditor
            style="text-align: left"
            v-model="form.content"
            @onUploadImg="onUploadImg"
            :toolbars="toolbars"
            :preview="false"
          />
        </div>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">{{
            itemConsult.length ? "提交修改" : "发布资讯"
          }}</a-button>
          <a-button @click="seeConsult" type="primary">预览</a-button>
          <a-button @click="cancelPublish">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <!-- 查看模态框 -->
    <a-modal
      v-model:visible="selectModel"
      :width="1200"
      :footer="null"
      :mask-closable="false"
    >
      <template #title> 预览资讯 </template>
      <SelectConsult :selectConsultData="selectConsultData" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import Axios from "axios";
import SelectConsult from "../selectConsult/index.vue";
import { uploadPhotoUrl } from "@/api/upload";
import { toolbars } from "./toolbars";
import { Message } from "@arco-design/web-vue";
import { useConsultStore } from "@/store/consult";
import { IConsultData } from "@/types/consult";
import { useAuth } from "@/hooks/useAuth";
const isAuth = useAuth();
const { consultCategoryData } = useConsultStore();
const formRef = ref();
const form = reactive({
  manger_id: `${new Date().getTime()}`,
  title: "",
  descs: "",
  cover_img: [],
  category: "",
  content: "",
  consult_id: "",
});
const props = defineProps<{
  validateForm: any;
  consultModelVisible: boolean;
  itemConsult: IConsultData[];
}>();

watch(
  () => props.itemConsult,
  () => {
    if (props.itemConsult.length) {
      form.manger_id = props.itemConsult[0].manger_id;
      form.consult_id = props.itemConsult[0].consult_id;
      form.title = props.itemConsult[0].title;
      form.descs = props.itemConsult[0].descs;
      form.category = props.itemConsult[0].category;
      form.content = props.itemConsult[0].content;
      if (props.itemConsult[0].cover_img) {
        form.cover_img.push({
          url: props.itemConsult[0].cover_img,
          name: "",
          uid: "",
        });
      } else {
        form.cover_img = [];
      }
    } else {
      form.manger_id = "";
      form.consult_id = "";
      form.cover_img = [];
    }
  }
);

const uploadChange = (_, currentFile) => {
  if (currentFile.status === "done") {
    if (currentFile.response.code !== 200) {
      return Message.error(currentFile.response.msg);
    } else {
      Message.success("配图上传成功");
      form.cover_img = [
        {
          url: currentFile.response.url,
          name: "",
          uid: "",
        },
      ];
    }
  }
};

watch(
  () => props.consultModelVisible,
  () => {
    if (!props.consultModelVisible) {
      formRef.value.resetFields();
    }
  }
);
const handleSubmit = ({ values, errors }) => {
  const resArr = [];
  for (let i in errors) {
    resArr.push(i);
  }
  if (!resArr.length) {
    props.validateForm(true, {
      ...values,
      cover_img: form.cover_img.length ? form.cover_img[0]?.url : "",
    });
  }
};
const onUploadImg = async (files, callback) => {
  if (!isAuth) return;
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("photo", file);
        Axios.post(uploadPhotoUrl, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            if (res.data.code !== 200) {
              return Message.error(res.data.msg);
            } else {
              rev(res);
            }
          })
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => item.data.url));
};

const cancelPublish = () => {
  props.validateForm(false);
  formRef.value.resetFields();
};

//点击查看
const selectModel = ref(false);
const selectConsultData = ref<IConsultData[]>([]);
const seeConsult = async () => {
  const res = await formRef.value.validate();
  const resArr = [];
  for (let i in res) {
    resArr.push(i);
  }
  if (!resArr.length) {
    selectModel.value = true;
    selectConsultData.value = [
      {
        ...form,
        consult_id: "",
        id: -1,
        manger_id: "",
        cover_img: form.cover_img.length ? form.cover_img[0]?.url : "",
      },
    ];
  }
};
</script>

<style lang="less" scoped>
.publicConsult {
  position: relative;
  left: -166px;
  .editor {
    width: 1600px;
  }
}
</style>
