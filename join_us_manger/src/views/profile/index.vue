<template>
  <div class="profile">
    <div class="box editor animate__animated animate__fadeInLeftBig" v-if="isEditor">
      <a-form
        ref="formRef"
        size="large"
        :model="form"
        :style="{ width: '490px' }"
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
          <a-input
            disabled
            v-model.trim="form.username"
            placeholder="请填写账号"
          />
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          :rules="[
            { minLength: 6, message: '登录密码最少为6位' },
            { maxLength: 16, message: '登录密码最多为16位' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input v-model.trim="form.password" placeholder="请填写登录密码" />
        </a-form-item>
        <a-form-item field="avatar" label="图像" class="avatarItem">
          <a-upload
            :action="uploadUserAvatarUrl"
            name="avatar"
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
        <a-form-item>
          <div class="btns">
            <a-button html-type="submit" type="primary">提交修改</a-button>
            <a-button @click="cancel">取消</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <div v-else class="box show animate__animated animate__fadeInRightBig">
      <div class="name"><span>昵称:</span>{{ mangerInfo.name }}</div>
      <div class="role">
        <span>角色:</span>
        <a-tooltip content="超级管理员可拥有操作的所有权限">
          <a-tag color="green" v-if="mangerInfo.manger_state == '1'">超级管理员</a-tag>
        </a-tooltip>
        <a-tooltip content="普通管理员目前仅可以查看部分功能">
        <a-tag color="orange" v-if="mangerInfo.manger_state== '0'">普通管理员</a-tag>
        </a-tooltip>
      </div>
      <div class="regTime">
        <span>注册时间:</span>{{ getTime(mangerInfo.regTime, "time") }}
      </div>
      <div class="avatar">
        <a-avatar
          :size="64"
          v-if="mangerInfo.avatar"
          :imageUrl="mangerInfo.avatar"
        ></a-avatar>
        <a-avatar v-else>
          <IconUser />
        </a-avatar>
      </div>

      <a-button type="primary" class="editorBtn" @click="isEditor = true"
        >编辑</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconPlus, IconUser } from "@arco-design/web-vue/es/icon";
import type { FileItem, ValidatedError } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
import { uploadUserAvatarUrl } from "@/api/upload";
import { useMangerStore } from "@/store/manger";
import { IMangerData } from "@/types/manger";
import { getTime } from "@/utils/formatTime";
import { updateManger } from "@/api";

const mangerInfo = computed(
  () => useMangerStore().mangerInfo[0] as IMangerData
);
const isEditor = ref(false);

type TFileItem = {
  url: string;
  name: string;
  uid: string;
};

const cancel = () => {
  isEditor.value = false;
  formRef.value.resetFields();
};
//提交
const handleSubmit = async ({
  values,
  errors,
}: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  const resArr = [];
  for (let i in errors) {
    resArr.push(i);
  }
  if (!resArr.length) {
    const params = {
      ...values,
      manger_id: mangerInfo.value.manger_id,
      avatar: file.value.length ? file.value[0].url : "",
    };
    const res: any = await updateManger(params);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    if (res.flag) {
      Message.success(res.msg);
      localStorage.clear();
      Message.warning("请您重新登录");
      location.reload();
    } else {
      Message.success(res.msg);
      useMangerStore().getManger();
      isEditor.value = false;
    }
  }
};
const formRef = ref();
const form = reactive({
  name: mangerInfo.value.name,
  username: mangerInfo.value.username,
  password: "",
});

const file = ref<TFileItem[]>([
  {
    url: mangerInfo.value.avatar,
    name: "",
    uid: "",
  },
]);



const onChange = (_: FileItem[], currentFile: FileItem) => {
  if (currentFile.status === "done") {
    if (currentFile.response.code !== 200) {
      return Message.error(currentFile.response.msg);
    } else {
      Message.success("头像上传成功");
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
</script>

<style lang="less" scoped>
.profile {
  .box {
    margin: 20px 0 0 20px;
    width: 400px;
    height: 230px;
    border-radius: 15px;
    
    padding: 23px 20px;
    box-sizing: border-box;
    border: 1px solid #eee;
    transition: all .2s linear;
    &:hover{
      box-shadow: 0 0 10px #ddd;
    }
  }
  .show {
    padding: 43px 30px;
    position: relative;
    &:hover{
      .editorBtn {
        opacity: 1;
      }
    }
    div {
      span {
        margin-right: 8px;
      }
    }
    .role {
      margin: 23px 0;
    }
    .name{
      margin-top: 10px;
    }
    .avatar {
      position: absolute;
      right: 40px;
      top: 40px;
  
    }
    .editorBtn {
      position: absolute;
      bottom: 25px;
      right: 40px;
      transition: all .18s linear;
      opacity: 0;
    }
  }
  .editor {
    padding: 43px 30px;
    width: 600px;
    height: 400px;
    .arco-form {
      position: relative;
      left: -20px;
    }
    .btns {
      margin-top: 8px;
      .arco-btn {
        margin-right: 20px;
      }
    }
  }
}
</style>
