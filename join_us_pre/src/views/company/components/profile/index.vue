<template>
  <div class="hr_info">
    <div v-if="!showInfo" class="infoBox">
      <template v-for="item in hrInfoList" :key="item.id">
      <div class="item"><span>昵称：</span>{{ item.name||'未设置昵称' }}</div>
      <div class="item"><span>账号：</span>{{ item.telephone }}</div>
      <div class="item"><span>状态：</span>
        <a-tag color="success" v-if="item.hr_state=='1' ">正常</a-tag>
        <a-tag color="red" v-else>异常</a-tag>
      </div>
      <div class="avatar">
        <a-avatar v-if="item.avatar" :src="item.avatar" :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <a-avatar v-else :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>
      <a-button @click="showInfo=true" type="primary" size="small" class="editor">编辑信息</a-button>
    </template>
    </div>
    <div v-else class="infoForm">
      <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
      @validate="handleValidate"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item has-feedback label="昵称" name="name">
        <a-input
          v-model:value.trim="formState.name"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item has-feedback label="账号" name="telephone">
        <a-input
        disabled
          v-model:value.trim="formState.telephone"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item has-feedback label="密码" name="password">
        <a-input
          type="password"
          v-model:value.trim="formState.password"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item has-feedback label="图像" name="">
        <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :action="uploadUserAvatarUrl"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img style="width: 100%" v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">图像</div>
        </div>
      </a-upload>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button style="margin-left: 10px"  @click="showInfo=false">取消</a-button>
      </a-form-item>
    </a-form>
    </div>
  
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from "ant-design-vue";
import {message} from "ant-design-vue"
import { LoadingOutlined,PlusOutlined,UserOutlined} from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";
import {updateHr} from "@/api"
import { useHrInfo } from "@/store/hr";
import { uploadUserAvatarUrl } from "@/api/upload";
import {IHrData} from "@/types/hr"
import {useHrState} from "@/hooks/useHrState"
const hr_id = useHrInfo().hr_id;
const hrInfoList = computed(()=>useHrInfo().hrInfoList as  IHrData[]) ;
const showInfo  = ref(false)
interface FormState {
  name: string;
  telephone: string;
  password: string;
  hr_identity: string | undefined;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: "",
  telephone: "",
  password: "",
  hr_identity: "",
});

onMounted(()=>{
  if(hrInfoList.value?.length){
    formState.name=hrInfoList.value[0]?.name
    formState.telephone=hrInfoList.value[0]?.telephone
    formState.hr_identity=hrInfoList.value[0]?.hr_identity
    imageUrl.value = hrInfoList.value[0]?.avatar
  }
})

const handleFinish =async (values: FormState) => {
  const reg = /^[a-z0-9]+$/i;
  if(values.password){
    if(!reg.test(values.password) || (values.password.length > 14 || values.password.length < 6)){
      return message.warning("密码只能由6-14位数字和字母组成")
    }
  }
  if(!(await useHrState()).state) return 
  const params = {...values,hr_id,avatar:imageUrl.value}
  const res:any = await updateHr(params)
  if(res.code!==200) return message.error(res.msg)
  message.success('修改成功')
  useHrInfo().getHrInfo(hr_id)
  showInfo.value = false
};
//点击用户头像
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>("");
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }

  if (info.file.status === "error") {
    loading.value = false;
    message.error("图片上传失败");
  }
  if (info.file.status === "done") {
    loading.value = false;
    if (info.file.response.code !== 200) return message.error("图片上传失败");
    imageUrl.value = info.file.response.url;
  }
};
const beforeUpload = (file: any) => {
  const allowImgType = ["jpeg", "png", "jpg"];
  if (!allowImgType.includes(file.type?.split("/")[1])) {
    message.error(`图片只能上传以下类型：${allowImgType.join("、")}`);
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片的大小不能超过 2MB!");
  }
  return allowImgType.includes(file.type?.split("/")[1]) && isLt2M;
};
let validateUserName = async (_rule: Rule, value: string) => {
  const reg =
    /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  if (value === "") {
    return Promise.reject("请填写您的手机号");
  } else if (!reg.test(formState.telephone)) {
    return Promise.reject("请输入正确格式的手机号");
  } else {
    return Promise.resolve();
  }
};

let validateName = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("您填写您的昵称");
  }
  if (value.length<2 || value.length>14) {
    return Promise.reject("昵称只能为2-14个字符组成");
  }else {
      return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  name: [{ required: true, validator: validateName, trigger: "change" }],
  telephone: [{required: true, validator: validateUserName, trigger: "change" }],
  // password: [{ validator: validateUserPsd, trigger: "change" }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const handleFinishFailed = (errors: any) => {
  // console.log(errors);
};
const resetForm = () => {
  formRef.value?.resetFields();
};
const handleValidate = (...args: any) => {
  // console.log(args);
};
</script>

<style scoped lang="less">
.hr_info{
  .infoBox{
    width: 300px;
    height: 200px;
    box-shadow: 0 0 20px #ddd;
    border-radius: 10px;
    padding: 20px 30px;
    box-sizing: border-box;
    position: relative;
    .item{
     margin:10px 0 15px
    }
    .avatar{
      position: absolute;
      right:30px;
      top:30px;
    }
    .editor{
      position: absolute;
      right:30px;
      bottom:30px;
    }
  }
  .infoForm{
    width: 500px;
    height: 300px;
  }
}
</style>
