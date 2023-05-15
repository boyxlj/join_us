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
        field="industry_name"
        label="行业名称"
        :rules="[
          { required: true, message: '行业名称必须填写' },
          { minLength: 2, message: '行业名称不能少于2个字符' },
          { maxLength: 20, message: '行业名称不能超过20个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.industry_name" placeholder="请填写行业名称" />
      </a-form-item>
      <a-form-item
        field="industry_other"
        label="行业备注"
        :rules="[
            { minLength: 2, message: '行业备注最少为2位' },
            { maxLength: 100, message: '行业备注最多为100位' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.industry_other" placeholder="请填写行业备注" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" :disabled="!useAuth(false)"  type="primary">{{
            itemIndustry.length ? "提交修改" : "确认添加"
          }}</a-button>
          <a-button @click="cancelPublish">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { IIndustryData } from "@/types/industry";
import { useAuth } from "@/hooks/useAuth";
const formRef = ref();
const form = reactive({
  industry_id: '',
  industry_name: "",
  industry_other: "",
});
const props = defineProps<{
  validateForm: any;
  industryModelVisible: boolean;
  itemIndustry: IIndustryData[];
}>();

watch(
  () => props.itemIndustry,
  () => {
    if (props.itemIndustry.length) {
      form.industry_id = props.itemIndustry[0].industry_id;
      form.industry_name = props.itemIndustry[0].industry_name;
      form.industry_other = props.itemIndustry[0].industry_other;
    } else {
      form.industry_id = "";
    }
  }
);


watch(
  () => props.industryModelVisible,
  () => {
    if (!props.industryModelVisible) {
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
