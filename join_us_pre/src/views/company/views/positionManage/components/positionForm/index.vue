<template>
  <a-form
    ref="formRef"
    :rules="rulesRef"
    :model="formState"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 16 }"
  >
    <a-form-item label="职位名称" name="position_name">
      <a-input
        placeholder="请填写职位名称"
        v-model:value="formState.position_name"
      />
    </a-form-item>
    <a-form-item label="招聘类型" name="job_type">
      <a-select placeholder="请填写招聘类型" v-model:value="formState.job_type">
        <a-select-option
          v-for="(item, index) in job_typeArr"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="职位薪资" name="salary">
      <a-select v-model:value="formState.salary" placeholder="请选择职位薪资">
        <a-select-option
          v-for="(item, index) in salaryArr"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="工作地点" name="city">
      <a-cascader
        expandTrigger="hover"
        v-model:value="formState.cityArr"
        :options="allCityList"
        :field-names="{
          label: 'name',
          value: 'name',
          children: 'subLevelModelList'
        }"
        placeholder="请选择职位发布城市"
      />
    </a-form-item>
    <a-form-item label="职位分类" name="position_type">
      <a-cascader
        expandTrigger="hover"
        v-model:value="formState.position_type"
        :options="positionTypeListCom"
        :field-names="{
          label: 'position_type_name',
          value: 'position_type_id',
          children: 'children'
        }"
        placeholder="请选择职位分类"
      />
    </a-form-item>
    <a-form-item label="工作经验" name="experiences">
      <a-select
        v-model:value="formState.experiences"
        placeholder="请选择经验要求"
      >
        <a-select-option
          v-for="(item, index) in experiencesArr"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="学历要求" name="degrees">
      <a-select placeholder="请选择学历要求" v-model:value="formState.degrees">
        <a-select-option
          v-for="(item, index) in degreesArr"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="福利待遇" name="welfare_tag">
      <a-select
        v-model:value="formState.welfare_tag"
        mode="tags"
        style="width: 100%"
        placeholder="请填写福利待遇"
      ></a-select>
    </a-form-item>
    <a-form-item label="职位描述" name="position_desc">
      <a-textarea
        v-model:value="formState.position_desc"
        showCount
        :rows="4"
        placeholder="请填写职位描述"
      />
    </a-form-item>
    <a-form-item style="margin-left: 180px; margin-top: 20px">
      <a-button
        type="primary"
        :disabled="submitBtnDisabled"
        @click="onSubmit"
        >{{ positionItem.length ? '提交修改' : '发布职位' }}</a-button
      >
      <a-button
        style="margin: 0 8px"
        :disabled="submitBtnDisabled"
        @click="cancelBtn"
        >取消</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { Form, message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { IPositionData } from '../../types'
import { useJobTypeStore } from '@/store/positionType'
import { useCity } from '@/store/city'
import { useCompanyInfo } from '@/store/company_hr'
import { useHrInfo } from '@/store/hr'
import { useGetConditionData } from '@/store/condition'
import { hrAddPosition, hrEditPosition2 } from '@/api'
import { useCompanyState } from '@/hooks/useCompanyState'
import { useHrState } from '@/hooks/useHrState'
const { allCityList } = useCity()
const conditions = useGetConditionData().conditionData
const { positionTypeList } = useJobTypeStore()
const { company_id } = useCompanyInfo()
const { hr_id } = useHrInfo()

const useForm = Form.useForm
const emit = defineEmits<{
  (e: 'closePublishOrUpdateModel', flag?: boolean, type?: string): void
}>()
const props = defineProps<{
  positionItem: IPositionData[]
  clearData: boolean
}>()
interface formType {
  position_name: string
  salary: string | undefined
  cityArr: any[]
  experiences: string | undefined
  degrees: string | undefined
  welfare_tag: any[]
  position_desc: string
  job_type: string | undefined
  position_type: any[]
  position_id: string
}
const formRef = ref<FormInstance>()
const formState = reactive<formType>({
  position_name: '',
  salary: undefined,
  cityArr: [],
  experiences: undefined,
  degrees: undefined,
  welfare_tag: [],
  position_desc: '',
  job_type: undefined,
  position_type: [],
  position_id: ''
})

const resetFrom = () => {
  formRef.value?.resetFields()
  formState.cityArr = []
  formState.position_type = []
  formState.welfare_tag = []
}

watch(
  () => props.positionItem,
  () => {
    if (props.positionItem.length) {
      formState.position_name = props.positionItem[0]?.position_name
      formState.salary = props.positionItem[0]?.salary
      formState.cityArr = [
        props.positionItem[0]?.cityName,
        props.positionItem[0]?.pos_region
      ]
      formState.experiences = props.positionItem[0]?.experiences
      formState.degrees = props.positionItem[0]?.degrees
      formState.welfare_tag = JSON.parse(props.positionItem[0]?.welfare_tag)
      formState.position_desc = props.positionItem[0]?.position_desc
      formState.job_type = props.positionItem[0]?.job_type
      formState.position_type = [
        props.positionItem[0]?.position_type1,
        props.positionItem[0]?.position_type2
      ]
      formState.position_type = [
        props.positionItem[0]?.position_type1,
        props.positionItem[0]?.position_type2
      ]
      formState.position_id = props.positionItem[0]?.position_id || ''
    } else {
      resetFrom()
    }
  },
  { immediate: true }
)

watch(
  () => props.clearData,
  () => {
    resetFrom()
  }
)

const rulesRef = reactive({
  position_name: [
    { required: true, message: '职位名称不能为空', trigger: 'blur' }
  ],
  salary: [{ required: true, message: '薪资不能为空', trigger: 'blur' }],
  cityArr: [{ required: true, message: '工作城市不能为空', trigger: 'blur' }],
  experiences: [
    { required: true, message: '工作经历不能为空', trigger: 'blur' }
  ],
  degrees: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
  welfare_tag: [{ required: true, message: '福利不能为空', trigger: 'blur' }],
  position_desc: [
    { required: true, message: '职位描述不能为空', trigger: 'blur' }
  ],
  job_type: [{ required: true, message: '职位类型不能为空', trigger: 'blur' }],
  position_type1: [
    { required: true, message: '职位分类不能为空', trigger: 'blur' }
  ],
  position_type2: [
    { required: true, message: '职位分类不能为空', trigger: 'blur' }
  ]
})

const { validate } = useForm(formState, rulesRef)

// watch(
//   () => props.clearData,
//   () => {
//     if (props.clearData) {
//       resetFrom();
//     }
//   }
// );
//删除数组中为不限的一项
type TConditionData = {
  code: number
  name: string
}
const dealWithData = (data: TConditionData[]) => {
  return data.filter((item) => item.name !== '不限')
}
const job_typeArr = conditions[0]
const experiencesArr = conditions[1]
const salaryArr = dealWithData(conditions[2])
const degreesArr = conditions[3]

const submitBtnDisabled = ref(false)
const onSubmit = async (values: any) => {
  if (!(await useCompanyState()).state) return
  if (!(await useHrState()).state) return
  await formRef.value?.validateFields()
  if (!formState.position_type.length)
    return message.warning('职位分类必须填写')
  if (!formState.cityArr.length) return message.warning('发布城市必须填写')
  const params = {
    ...formState,
    company_id,
    hr_id,
    welfare_tag: JSON.stringify(formState.welfare_tag),
    cityName: formState.cityArr.length
      ? formState.cityArr[formState.cityArr.length - 2]
      : '',
    pos_region: formState.cityArr.length
      ? formState.cityArr[formState.cityArr.length - 1]
      : '',
    position_type1: formState.position_type.length
      ? formState.position_type[0]
      : '',
    position_type2: formState.position_type.length
      ? formState.position_type[1]
      : ''
  }
  if (props.positionItem.length) {
    submitBtnDisabled.value = true
    const res: any = await hrEditPosition2(params).finally(
      () => (submitBtnDisabled.value = false)
    )
    if (res.code !== 200) return message.error('职位修改失败')
    message.success('职位修改成功，正在加速审核中')
    emit('closePublishOrUpdateModel', true, 'update')
  } else {
    submitBtnDisabled.value = true
    const res: any = await hrAddPosition(params).finally(
      () => (submitBtnDisabled.value = false)
    )
    if (res.code !== 200) return message.error('职位发布失败')
    message.success('职位发布成功，正在加速审核中')
    emit('closePublishOrUpdateModel', true, 'publish')
  }
}

//点击取消
const cancelBtn = () => {
  resetFrom()
  emit('closePublishOrUpdateModel')
}

const positionTypeListCom = computed<any[]>(() => {
  const resultArr: any[] = positionTypeList.map((item: any) => {
    return {
      position_type_name: item.position_type_name,
      position_type_id: item.position_type_id,
      children: []
    }
  })
  const secondArr: any[] = positionTypeList
    .map((item: any) => item.children)
    .flat(Infinity)
    .map((item: any) => {
      return {
        position_type_id: item.position_type_id,
        position_type_name: item.type_name,
        parent: item.parent
      }
    })
  secondArr.forEach((item: any) => {
    if (
      resultArr.findIndex(
        (item2: any) => item2.position_type_id === item.parent
      ) !== -1
    ) {
      resultArr[
        resultArr.findIndex(
          (item2: any) => item2.position_type_id === item.parent
        )
      ].children.push(item)
    }
  })
  return resultArr
})
</script>

<style lang="less" scoped></style>
