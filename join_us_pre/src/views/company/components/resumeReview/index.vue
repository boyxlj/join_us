<template>
    <div>
        这是简历审核组件
    </div>
</template>

<script setup lang="ts">
import { deliveryRecord } from '@/api'
import { message } from 'ant-design-vue'
interface deliveryRecordType {
    userId: string,
    advantage: string,
    age: number,
    apply_state: string,
    avatar: string,
    born: string,
    degree: string,
    email: string,
    enter_schoolTime: string,
    gender: string,
    hope_city: string,
    hope_job: string,
    hope_job_type: string,
    hope_salary: string,
    leave_schoolTime: string,
    major: string,
    name: string,
    phone: string,
    position_name: string,
    school: string,
    school_exp: string,
    school_type: string
}
const propertyMap = {
    position_name: '职位名称',
    name: '姓名',
    phone: '手机号',
    email: '邮箱',
    school: '学校',
    degree: '学历',
    leave_schoolTime: '毕业时间',
    avatar: '头像'
}
const columns = ref([])
const deliveryRecordList = ref<Array<deliveryRecordType>>([])
const company_id = localStorage.getItem('company_id') as string
const telephone = JSON.parse(localStorage.getItem('loginInfo') as string).telephone
const pageIndex = ref(1)
const pageSize = ref(4)
const total = ref(0)
function getDeliveryRecord() {
    deliveryRecord(company_id, telephone, pageIndex.value, pageSize.value).then((res: any) => {
        if (res.code === 200) {
            deliveryRecordList.value = res.data
            total.value = res.total
            
        } else {
            message.error('数据查询失败!')
        }
    })
}
getDeliveryRecord()
</script>

<style scoped>

</style>