<template>
  <div class="publicConsult">
    <a-form
      ref="formRef"
      size="large"
      :model="form"
      :style="{ width: '450px', textAlign: 'center' }"
      @submit="handleSubmit"
    
    >
    <a-form-item field="avatar" label="轮播图片" class="avatarItem">
          <a-upload
            :action="uploadPhotoUrl"
            name="photo"
            :fileList="file"
            :show-file-list="false"
            @change="onChange"
          >
            <template #upload-button>
              <div>
                <div
                  class="arco-upload-list-picture custom-upload-avatar"
                  v-if="file && file[0].url"
                >
                  <img :src="file[0].url" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                </div>
                <div class="arco-upload-picture-card" v-else>
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
      <a-form-item
        field="links"
        label="跳转链接"
        :rules="[
          { minLength: 2, message: '跳转链接不能少于2个字符' },
          { maxLength: 180, message: '跳转链接不能超过180个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.links" placeholder="请填写跳转链接" />
      </a-form-item>
   
      <a-form-item
        field="others"
        label="轮播备注"
        :rules="[
            { minLength: 2, message: '备注最少为2位' },
            { maxLength: 100, message: '备注最多为100位' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.others" placeholder="请填写备注" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" :disabled="!useAuth(false)"  type="primary">{{
            itemSwiper.length ? "提交修改" : "确认添加"
          }}</a-button>
          <a-button @click="cancelPublish">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconPlus, IconUser } from "@arco-design/web-vue/es/icon";
import { ISwiperData } from "@/types/swiper";
import type { FileItem, ValidatedError ,} from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
import { uploadPhotoUrl } from "@/api/upload";
import { useAuth } from "@/hooks/useAuth";
const formRef = ref();
const form = reactive({
  links: '',
  others: "",
  swiper_id: "",
});

const file = ref<any[]>([
  {
    url: '',
    name: "",
    uid: "",
  },
]);

const props = defineProps<{
  validateForm: any;
  swiperModelVisible: boolean;
  itemSwiper: ISwiperData[];
}>();


const onChange = (_: FileItem[], currentFile: FileItem) => {
  if(!useAuth(false)) return
  if (currentFile.status === "done") {
    if (currentFile.response.code !== 200) {
      return Message.error(currentFile.response.msg);
    } else {
      Message.success("图片上传成功");
      file.value = [
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
  () => props.itemSwiper,
  () => {
    if (props.itemSwiper?.length) {
      form.links = props.itemSwiper[0].links;
      form.others = props.itemSwiper[0].others;
      form.swiper_id = props.itemSwiper[0].swiper_id;
      if(props.itemSwiper[0].img){
        clearFiles(props.itemSwiper[0].img)
      }else{
        clearFiles()
      }
    } else {
      form.swiper_id = "";
      clearFiles()
    }
  }
);


const clearFiles = (img?:string)=>{
  file.value = [
      {
        url: img?img:'',
        name: "",
        uid: "",
        },
    ]
}

watch(
  () => props.swiperModelVisible,
  () => {
    if (!props.swiperModelVisible) {
      formRef.value.resetFields();
    }
  }
);
const handleSubmit = ({ values, errors }:any) => {
  if(!file.value[0].url){
    return Message.warning('请先上传图片')
  }
  const resArr = [];
  for (let i in errors) {
    resArr.push(i);
  }
  if (!resArr.length) {
    props.validateForm(true, {
      ...values,img:file.value[0].url
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
