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
        field="type_name"
        label="类型名称"
        :rules="[
          { required: true, message: '类型名称必须填写' },
          { minLength: 2, message: '类型名称不能少于2个字符' },
          { maxLength: 20, message: '类型名称不能超过20个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model.trim="form.type_name" placeholder="请填写类型名称" />
      </a-form-item>
      <a-form-item
        field="parent"
        label="职位分类"
        :rules="[
          { required: true, message: '职位分类必须填写' },
        ]"
        :validate-trigger="['change', 'input']"
      >
      <a-select  v-model="form.parent" allow-clear  allow-search   :style="{width:'320px'}" placeholder="请选择职位一级分类">
      <a-option :value="item.position_type_id" v-for="(item,index) in positionCategory1List" :key="index">{{ item.type_name }}</a-option>
    </a-select>
  </a-form-item>
      <a-form-item
        field="others"
        label="备注"
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
            itemCategory1.length ? "提交修改" : "确认添加"
          }}</a-button>
          <a-button @click="cancelPublish">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { IPositionTypeData } from "@/types/positionType";
import { useAuth } from "@/hooks/useAuth";
import {usePositionTypeStore} from "@/store/positionType"
import {IPositionCategoryTypeData} from "@/types/positionType"
const positionCategory1List:IPositionCategoryTypeData[]  = usePositionTypeStore().positionCategory1List    
const formRef = ref();
const form = reactive({
  position_type_id: '',
  type_name: "",
  others: "",
  parent:"",
});
const props = defineProps<{
  validateForm: any;
  category1ModelVisible: boolean;
  itemCategory1: IPositionTypeData[];
}>();

watch(
  () => props.itemCategory1,
  () => {
    if (props.itemCategory1.length) {
      form.position_type_id = props.itemCategory1[0].position_type_id;
      form.type_name = props.itemCategory1[0].type_name;
      form.others = props.itemCategory1[0].others;
      form.parent = props.itemCategory1[0].parent;
    } else {
      form.position_type_id = "";
      form.parent = "";
    }
  }
);


watch(
  () => props.category1ModelVisible,
  () => {
    if (!props.category1ModelVisible) {
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
