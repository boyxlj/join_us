<template>
  <a-modal
    :keyboard="false"
    width="1000px"
    :maskClosable="false"
    v-model:visible="visible"
    centered
    title=""
    :footer="null"
    @cancel="closeModel"
  >
    <div class="content">
      <a-steps
        v-model:current="current"
        type="navigation"
        size="small"
        :style="stepStyle"
      >
        <a-step disabled title="温馨提示" description="信息告知." />
        <a-step disabled title="公司基本信息" description="完善公司基本信息." />
        <a-step disabled title="公司企业文化" description="完善企业文化信息." />
      </a-steps>
      <div class="step1" v-show="current == 0">
        <h1>
          请可选择您所在的公司或申请加入，完善并提交。待后台审核通过后您就可以发布职位啦！
        </h1>
        <h1>如申请入驻，请务必认真填写您的公司信息</h1>
        <div class="selectCompany">
          <a-select
            allowClear
            showSearch
            :showArrow="false"
            ref="select"
            v-model:value="selectCompany"
            placeholder="请选择您的公司"
          >
            <a-select-option
              v-for="(item, index) in companyData"
              :key="index"
              :value="item.company_name"
              >{{ item.company_name }}</a-select-option
            >
          </a-select>
        </div>
        <a-button type="primary" style="margin: 0 10px" @click="clickAdd"
          >加入公司</a-button
        >
        <a-button type="primary" style="margin: 0 10px" @click="clickBegin"
          >申请入驻</a-button
        >
      </div>
      <div class="companyBaseForm" v-show="current == 1">
        <CompanyBaseForm :backStep="backStep" :getData="getData" />
      </div>
      <div class="companyOthersForm" v-show="current == 2">
        <CompanyOtherForm :getData2="getData2" :backStep="backStep" />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import CompanyBaseForm from './components/companyBaseForm/index.vue'
import CompanyOtherForm from './components/companyOtherForm/index.vue'
import { emitter } from '@/utils/emitter'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { hrAddCompany, getAllCompany, setHrCompany } from '@/api'
import { useCompanyInfo } from '@/store/company_hr'
import { useHrInfo } from '@/store/hr'
import { message, Modal } from 'ant-design-vue'
const router = useRouter()
const current = ref<number>(0)
let visible = ref(false)
//选中的公司id
const selectCompany = ref(undefined)
onMounted(() => {
  emitter.on('changeCompanyState', (val) => {
    visible.value = true
    selectAllCompany()
  })
})
type TCompanyList = {
  company_id: string
  company_name: string
}
const companyData = ref<TCompanyList[]>([])

//点击添加公司
const clickAdd = () => {
  const token = localStorage.getItem('token')
  const hr_id = localStorage.getItem('hr_id')
  if (!selectCompany.value)
    return message.warning('请先选择您所在的公司,或申请入驻')
  const company_id = companyData.value.filter(
    (item) => item.company_name == selectCompany.value
  )
  submitAdd(hr_id as string, company_id[0].company_id, token as string)
}

const submitAdd = async (hr_id: string, company_id: string, token: string) => {
  Modal.confirm({
    title: '温馨提示',
    cancelText: '取消',
    okText: '确认绑定',
    centered: true,
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      { style: 'font-weight:bold;' },
      `请确认您要绑定的公司:
       ${selectCompany.value}`
    ),
    onOk: async () => {
      const res: any = await setHrCompany({ hr_id, company_id })
      if (res.code !== 200) return message.error(res.msg)
      message.success('绑定成功')
      useCompanyInfo().saveCompanyId(company_id)
      useCompanyInfo().getCompanyInfo(company_id)
      useHrInfo().saveHrId(hr_id as string)
      useHrInfo().getHrInfo(hr_id as string)
      visible.value = false
      localStorage.setItem('token', token)
      localStorage.removeItem('hr_id')
      setTimeout(() => {
        router.replace('/company')
      }, 200)
    },
    onCancel() {
      // console.log('Cancel');
    },
    class: 'test123'
  })
}

//查询所有公司
const selectAllCompany = async () => {
  const res: any = await getAllCompany()
  if (res.code !== 200) return (companyData.value = [])
  companyData.value = res.data
}

const closeModel = () => {
  localStorage.removeItem('companyToken')
  localStorage.removeItem('hr_id')
  localStorage.removeItem('loginInfo')
}

const clickBegin = () => {
  const companyToken = localStorage.getItem('companyToken')
  const hr_id = localStorage.getItem('hr_id')
  if (!companyToken || !hr_id)
    return message.warning('您的登录已失效，请您重新登录')
  current.value++
}

let params = {}

//返回上一步
const backStep = () => {
  current.value--
}
//接收公司基本信息数据 step2
const getData = (value: any) => {
  params = { ...params, ...value }
  current.value++
}
//接收公司基本福利数据 step3
const getData2 = async (value: any) => {
  const token = localStorage.getItem('token')
  const hr_id = localStorage.getItem('hr_id')
  const mewParams = { ...params, ...value, hr_id }
  const res: any = await hrAddCompany(mewParams)
  if (res.code !== 200) return message.error('绑定公司失败')
  localStorage.setItem('token', token as string)
  message.success('绑定公司信息提交成功，正在加速审核')
  useCompanyInfo().saveCompanyId(res.company_id)
  useCompanyInfo().getCompanyInfo(res.company_id)
  useHrInfo().saveHrId(res.hr_id)
  useHrInfo().getHrInfo(res.hr_id)
  visible.value = false
  setTimeout(() => {
    router.replace('/company')
    localStorage.removeItem('hr_id')
  }, 400)
}

const handleOk = () => {
  visible.value = false
  console.log('ok')
}

const stepStyle = {
  marginBottom: '60px',
  boxShadow: '0px -1px 0 0 #e8e8e8 inset'
}
</script>

<style lang="less" scoped>
.content {
  min-height: 500px;
  .step1 {
    text-align: center;
    margin-top: 90px;
    h1 {
      font-size: 20px;
      margin-bottom: 30px;
    }
    .selectCompany {
      width: 400px;
      margin: 50px auto 40px;

      .ant-select {
        width: 100%;
        text-align: left;
      }
      ::v-deep(.ant-select-selector) {
        border-radius: 4px !important;
      }
    }
    .ant-but {
      border-radius: 4px;
      margin-top: 10px;
    }
  }
}
.ant-input {
  border-radius: 4px !important;
}
.ant-btn {
  border-radius: 4px !important;
}
::v-deep(.ant-select-selection-item) {
  border-radius: 4px !important;
}
::v-deep(.ant-picker) {
  border-radius: 4px !important;
}
</style>
